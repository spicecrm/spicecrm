/**
 * @module ModuleWorkflow
 */
import {Injectable, Injector, OnDestroy} from '@angular/core';
import {SpicePalette} from "../../../include/bpmndiagram/SpicePalette";
import {SpiceContextPad} from "../../../include/bpmndiagram/SpiceContextPad";
import {libloader} from "../../../services/libloader.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {WorkflowTaskTypeI} from "../interfaces/workflow.interfaces";
import {WorkflowManagerService} from "./workflowmanager.service";

/**
 * @ignore
 */
declare var BpmnJS;

/**
 * provide bpmn-js library instance and api
 */
@Injectable()
export class WorkflowDiagramService implements OnDestroy {

    /**
     * holds the diagram
     * @private
     */
    public bpmnJS: any;
    private diagramListeners: { event: string, listener: any }[] = [];
    /**
     * help detect if the added diagram element was just a replace
     * @private
     */
    private replacingDiagramElement: boolean = false;

    constructor(private libLoader: libloader,
                private model: model,
                private modal: modal,
                private workflowManagerService: WorkflowManagerService,
                private injector: Injector) {
    }

    /**
     * @return boolean if the diagram library was loaded
     */
    get diagramLoaded() {
        return !!this.bpmnJS;
    }

    /**
     * @return the workflow tasks from model data
     */
    get tasks() {
        return this.model.data.tasks;
    }

    set tasks(data) {
        this.model.data.tasks = data;
        this.workflowManagerService.tasks = data;

        this.workflowManagerService.sortTasksBySequence();
    }

    /**
     * @return the workflow tasks which are not deleted from model data
     */
    get filteredTasks() {
        return this.model.data.tasks.filter(t => t.deleted != 1);
    }

    /**
     * adds a task
     */
    public addTask(diagramEvent, sourceTaskID: string) {

        const filterTypes = diagramEvent.element.type == 'bpmn:ExclusiveGateway' ? ['gateway_event_based', 'gateway_decision'] : ['regular'];
        this.workflowManagerService.promptTaskType(filterTypes).subscribe((type: WorkflowTaskTypeI) => {
            if (!type) {
                this.bpmnJS.get('modeling').removeElements([diagramEvent.element]);
                return;
            }

            const newTask = this.workflowManagerService.generateNewTask(type);
            this.tasks = [...this.tasks, newTask];

            this.adjustDiagramElementAfterAdd(diagramEvent.element, newTask, type);
            this.bpmnJS.get('modeling').updateProperties(diagramEvent.element, {taskId: newTask.id});
            this.adjustTaskFromDiagram(newTask, diagramEvent, sourceTaskID);
        });
    }

    /**
     * adjust the diagram element after adding the new task
     */
    public adjustDiagramElementAfterAdd(element, task, type) {

        const modeling = this.bpmnJS.get('modeling');
        if (type.type == 'gateway_event_based') {
            const replace = this.bpmnJS.get('replace');
            this.replacingDiagramElement = true;
            const newElement = replace.replaceElement(element, {type: 'bpmn:EventBasedGateway'});
            modeling.updateProperties(newElement, {taskId: task.id});
            modeling.updateLabel(newElement, task.name);

        } else {
            modeling.updateLabel(element, task.name);
        }
    }

    /**
     * create the missing diagram elements from tasks
     */
    public createMissingDiagramElements() {

        if (!this.bpmnJS) return;

        const elementRegistry = this.bpmnJS.get('elementRegistry');
        const modeling = this.bpmnJS.get('modeling');
        const elementFactory = this.bpmnJS.get('elementFactory');
        const elements = this.getAllDiagramElements();

        this.filteredTasks.filter(t => !elements.some(e => e.businessObject.$attrs.taskId == t.id))
            .forEach(task => {
                let type = 'bpmn:IntermediateThrowEvent';
                if (!!task.closetask) type = 'bpmn:EndEvent';
                if (!!task.primarytask) type = 'bpmn:StartEvent';

                const newShape = elementFactory.createShape({type});
                const process = elementRegistry.get('Process_1');
                modeling.updateProperties(newShape, {taskId: task.id});

                const tap = 100, x = (type == 'bpmn:StartEvent' ? tap : (tap * this.filteredTasks.length)) + tap,
                    y = (tap * this.filteredTasks.length);
                modeling.createElements(newShape, {x, y}, process);
            });

        this.saveDiagramData();
    }

    /**
     * create new diagram instance
     */
    public loadDiagram() {

        this.libLoader.loadLib('bpmn-js').subscribe(res => {

            if (!res.loaded) return;

            this.bpmnJS = new BpmnJS({
                moddleExtensions: {
                    spice: {
                        name: 'WorkflowTask', prefix: 'spice', xml: {'tagAlias': 'lowerCase'},
                        types: [{
                            name: 'WorkflowTaskDetails', superClass: ['Element'],
                            properties: [{name: 'taskId', isAttr: true, type: 'String'}]
                        }]
                    }
                },
                additionalModules: [{
                    __init__: ['spicePalette', 'spiceContextPad'], // , 'eventBusLogger'],
                    spicePalette: ['type', SpicePalette],
                    spiceContextPad: ['type', SpiceContextPad]
                    // ,eventBusLogger: ['type', EventBusLogger]
                }]
            });

            if (!this.model.getField('diagram_data')) {
                this.bpmnJS.createDiagram().then(() =>
                    this.bpmnJS.get('modeling').removeElements([
                        this.bpmnJS.get('elementRegistry').get('StartEvent_1')
                    ])
                );
            } else {
                const xml = this.model.getField('diagram_data').replaceAll('\n', '');
                this.bpmnJS.importXML(xml); // return promise
            }

        });
    }

    /**
     * cleanup diagram elements
     */
    public cleanupDiagramElements() {

        const deleteElements = this.getAllDiagramElements()
            .filter(e => !this.filteredTasks.some(t => t.id == e.businessObject.$attrs.taskId) || this.tasks.some(t => t.deleted == 1 && t.id == e.businessObject.$attrs.taskId));

        if (deleteElements.length == 0) return;

        this.bpmnJS.get('modeling').removeElements(deleteElements);
    }

    /**
     * update diagram elements label
     */
    public updateDiagramElementsLabel() {

        const modeling = this.bpmnJS.get('modeling');

        this.getAllDiagramElements().forEach(e => {

            const task = this.filteredTasks.find(task => e.businessObject.$attrs.taskId == task.id);

            if (!task) return;

            modeling.updateLabel(e, task.name);
        });
    }

    /**
     * save diagram xml data to the workflow field
     */
    public saveDiagramData() {
        this.bpmnJS.saveXML().then(data =>
            this.model.setField('diagram_data', data.xml)
        );
    }

    /**
     * set the task related to the diagram element to deleted
     */
    public handleDiagramElementDelete(event) {
        this.tasks.some(task => {
            if (this.getTaskIDFromEvent(event) == task.id) {
                task.deleted = 1;
                return true;
            }
        });
    }

    /**
     * attach the diagram to its container and listen to its events
     * @param diagramContainer
     */
    public attachDiagram(diagramContainer: HTMLElement) {
        this.bpmnJS.attachTo(diagramContainer);
        this.updateDiagramFromTasks();
        this.listenToShapeChange();
    }

    /**
     * detach the diagram from the dom and remove all listeners
     */
    public detachDiagram() {
        this.bpmnJS.detach();
        this.removeAllDiagramListeners();
    }

    /**
     * destroy the diagram
     */
    public ngOnDestroy() {
        if (this.bpmnJS) {
            this.bpmnJS.destroy();
        }
    }

    /**
     * listen to shape change
     * @private
     */
    private listenToShapeChange() {

        let sourceTaskID;

        this.listenToDiagramEvent('shape.added', event => {

            if (event.element.type == 'label') return;

            if (this.replacingDiagramElement) {
                return this.replacingDiagramElement = false;
            }

            this.addTask(event, sourceTaskID);
            sourceTaskID = undefined;

            this.bpmnJS.get('canvas').zoom('fit-viewport');

        });

        this.listenToDiagramEvent('autoPlace.start', event => {
            sourceTaskID = event.source.businessObject.$attrs.taskId;
        });

        this.listenToDiagramEvent('commandStack.element.updateLabel.preExecute', event => {
            this.updateTaskNameFromDiagram(event);
        });

        this.listenToDiagramEvent('shape.removed', event => {
            this.handleDiagramElementDelete(event);
        });

        this.listenToDiagramEvent('drag.ended', () => {
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('edit.task', (event, element) => {
            this.openEditModal(element.businessObject.$attrs.taskId);
        });
    }

    /**
     * listen to diagram event and register in
     * @param event
     * @param fn
     * @private
     */
    private listenToDiagramEvent(event, fn) {
        const eventBus = this.bpmnJS.get('eventBus');
        eventBus.on(event, fn);
        this.diagramListeners.push({event, listener: fn});
    }

    /**
     * remove all diagram listeners
     * @private
     */
    private removeAllDiagramListeners() {
        const eventBus = this.bpmnJS.get('eventBus');

        this.diagramListeners.forEach(e => eventBus.off(e.event, e.listener));
        this.diagramListeners = [];
    }

    /**
     *
     * @param event
     * @private
     */
    private getTaskIDFromEvent(event): string {
        return event.element.businessObject.$attrs.taskId;
    }

    /**
     * update the diagram from tasks data
     * @private
     */
    private updateDiagramFromTasks() {
        this.cleanupDiagramElements();
        this.createMissingDiagramElements();
        this.updateDiagramElementsType();
        this.updateDiagramElementsConnection();
        this.updateDiagramElementsLabel();
    }

    /**
     * update diagram elements type
     * @private
     */
    private updateDiagramElementsType() {

        const replace = this.bpmnJS.get('replace');
        const modeling = this.bpmnJS.get('modeling');

        this.getAllDiagramElements().forEach(element => {
            const task = this.filteredTasks.find(t => t.id == element.businessObject.$attrs.taskId);
            let taskType = 'bpmn:IntermediateThrowEvent';
            if (!!task.closetask) taskType = 'bpmn:EndEvent';
            if (!!task.primarytask) taskType = 'bpmn:StartEvent';

            if (taskType == element.type) return;

            const newElement = replace.replaceElement(element, {type: taskType});
            modeling.updateProperties(newElement, {taskId: task.id});
        });
    }

    /**
     * @return any[] all diagram elements
     * @private
     */
    private getAllDiagramElements(): any[] {
        return this.bpmnJS.get('elementRegistry')
            .filter(e => ['bpmn:IntermediateThrowEvent', 'bpmn:EndEvent', 'bpmn:StartEvent', 'bpmn:ExclusiveGateway', 'bpmn:EventBasedGateway'].indexOf(e.type) > -1);
    }

    /**
     * update the diagram elements connection
     * @private
     */
    private updateDiagramElementsConnection() {

        const modeling = this.bpmnJS.get('modeling');
        const elements = this.getAllDiagramElements();

        this.filteredTasks.forEach(task => {

            if (!Array.isArray(task.type_config.next_tasks)) return;

            let nextTaskElement;

            if (this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision') {

                task.type_config.decisions.forEach(decision => {
                    nextTaskElement = elements.find(e => e.businessObject.$attrs.taskId == decision.id);
                });
            } else {
                task.type_config.next_tasks.forEach(nextTaskId => {
                    nextTaskElement = elements.find(e => e.businessObject.$attrs.taskId == nextTaskId);
                });
            }

            const taskElement = elements.find(e => e.businessObject.$attrs.taskId == task.id);
            modeling.connect(taskElement, nextTaskElement);
        });
    }

    /**
     * adjust task data from diagram element
     * @param newTask
     * @param diagramEvent
     * @param sourceTaskID
     * @private
     */
    private adjustTaskFromDiagram(newTask, diagramEvent, sourceTaskID: string) {

        if (diagramEvent.element.type == 'bpmn:StartEvent') {
            newTask.primarytask = true;
        }

        if (diagramEvent.element.type == 'bpmn:EndEvent') {
            newTask.closetask = true;
        }

        if (this.filteredTasks.length <= 1) {
            this.saveDiagramData();
            return;
        }

        this.assignNextTaskFromDiagram(sourceTaskID, newTask);

        this.saveDiagramData();
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateTaskNameFromDiagram(event) {
        this.filteredTasks.some(task => {
            if (event.context.element.businessObject.$attrs.taskId == task.id) {
                task.name = event.context.newLabel;
                return true;
            }
        });
    }

    /**
     * assign next task
     * @param sourceTaskID
     * @param newTask
     * @private
     */
    private assignNextTaskFromDiagram(sourceTaskID, newTask) {

        if (!sourceTaskID) return;

        this.filteredTasks.some(task => {
            if (sourceTaskID == task.id) {

                if (!task.type_config) task.type_config = {};

                if (this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision') {

                    task.type_config.decisions = [...(task.type_config.decisions ?? []), {id: newTask.id, name: newTask.name}];

                } else {
                    task.type_config.next_tasks = [...(task.type_config.next_tasks ?? []), newTask.id];
                }

                return true;
            }
        });
    }

    private openEditModal(taskId) {
        this.modal.openModal('WorkflowManagerTaskEditModal', true, this.injector).subscribe(ref => {
            ref.instance.task = this.filteredTasks.find(t => t.id == taskId);
            ref.instance.response.subscribe(taskData => {
                this.tasks = [...this.tasks.filter(t => t.id != taskData.id), taskData];
            });
        });
    }
}

// tslint:disable-next-line:max-classes-per-file
class EventBusLogger {
    $inject = ['eventBus'];

    constructor(eventBus) {
        const fire = eventBus.fire.bind(eventBus);
        let counter = 0;
        eventBus.fire = (type, data) => {
            fire(type, data);
            if (['element.hover', 'element.mousemove', 'element.out', 'element.marker.update'].indexOf(type) > -1) {
                console.log(type, data, counter++);
            }
        };
    }
}

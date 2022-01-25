/**
 * @module ModuleWorkflow
 */
import {Injectable, Injector, OnDestroy} from '@angular/core';
import {SpicePalette} from "../../../include/bpmndiagram/SpicePalette";
import {SpiceContextPad} from "../../../include/bpmndiagram/SpiceContextPad";
import {libloader} from "../../../services/libloader.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {
    BpmnDiagramElementI,
    BpmnDiagramEventI,
    WorkflowTaskDefinitionI,
    WorkflowTaskTypeI
} from "../interfaces/workflow.interfaces";
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
    public bpmnJS: {
        get(service: string),
        saveXML(),
        importXML(xml: string),
        destroy(),
        createDiagram(),
        attachTo(el: any),
        detach()
    };
    /**
     * holds the diagram listeners to remove them on destroy
     * @private
     */
    private diagramListeners: { event: string, listener: any }[] = [];
    /**
     * help detect if the added diagram element was just a replacement
     * @private
     */
    private replacingDiagramElement: boolean = false;
    /**
     * true while prompting to select the task type
     * @private
     */
    private addingTask: boolean = false;
    /**
     * holds the id of the source task in connection add until the adding task process is done
     * @private
     */
    private connectingSourceId: string;
    /**
     * holds the diagram element types
     * @private
     */
    private readonly diagramElementTypes: string[] = [
        'bpmn:IntermediateThrowEvent',
        'bpmn:EndEvent',
        'bpmn:StartEvent',
        'bpmn:ExclusiveGateway',
        'bpmn:EventBasedGateway'
    ];

    constructor(private libLoader: libloader,
                private model: model,
                private modal: modal,
                private workflowManagerService: WorkflowManagerService,
                private injector: Injector) {
    }

    /**
     * @return boolean if the diagram library was loaded
     */
    get diagramLoaded(): boolean {
        return !!this.bpmnJS;
    }

    /**
     * @return the workflow tasks from model data
     */
    get tasks(): WorkflowTaskDefinitionI[] {
        return this.model.data.tasks;
    }

    set tasks(data: WorkflowTaskDefinitionI[]) {
        this.model.data.tasks = data;
        this.workflowManagerService.tasks = data;

        this.workflowManagerService.sortTasksBySequence();
    }

    /**
     * @return the workflow tasks which are not deleted from model data
     */
    get filteredTasks(): WorkflowTaskDefinitionI[] {
        return this.model.data.tasks.filter(t => t.deleted != 1);
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
     * adds a task
     */
    public addTask(diagramElement: BpmnDiagramElementI) {

        const newTask = this.workflowManagerService.generateNewTask(undefined);
        this.addingTask = true;

        const filterTypes = diagramElement.type == 'bpmn:ExclusiveGateway' ? ['gateway_event_based', 'gateway_decision'] : ['regular'];
        this.workflowManagerService.promptTaskType(filterTypes).subscribe((type: WorkflowTaskTypeI) => {

            if (!type) {
                this.bpmnJS.get('modeling').removeElements([diagramElement]);
                return;
            }

            newTask.tasktype = type.id;
            this.tasks = [...this.tasks, newTask];

            this.connectTasks(this.connectingSourceId, newTask);
            this.adjustDiagramElementAfterAdd(diagramElement, newTask, type);

            this.setTaskStartEndFromDiagram(newTask, diagramElement);
            this.bpmnJS.get('modeling').updateProperties(diagramElement, {taskId: newTask.id});

            this.addingTask = false;
            this.connectingSourceId = undefined;
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

            // todo register listeners
            SpiceContextPad.taskTypes = this.workflowManagerService.types;

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
                    __init__: ['spicePalette', 'spiceContextPad'],
                    spicePalette: ['type', SpicePalette],
                    spiceContextPad: ['type', SpiceContextPad]
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
     * set the task related to the diagram element to deleted
     */
    public handleDiagramElementDelete(element: BpmnDiagramElementI) {
        this.tasks.some(task => {
            if (element.businessObject.$attrs.taskId == task.id) {
                task.deleted = 1;
                return true;
            }
        });
    }

    /**
     * listen to shape change
     * @private
     */
    private listenToShapeChange() {

        this.listenToDiagramEvent('shape.added', (event: BpmnDiagramEventI) =>
            this.handleDiagramElementAdd(event.element)
        );

        this.listenToDiagramEvent('commandStack.element.updateLabel.preExecute', (event: BpmnDiagramEventI) =>
            this.updateTaskNameFromDiagram(event)
        );

        this.listenToDiagramEvent('shape.removed', (event: BpmnDiagramEventI) =>
            this.handleDiagramElementDelete(event.element)
        );

        this.listenToDiagramEvent('connection.added', (event: BpmnDiagramEventI) =>
            this.handleDiagramConnectionAdd(event.element)
        );

        this.listenToDiagramEvent('connection.removed', (event: BpmnDiagramEventI) =>
            this.handleDiagramConnectionDelete(event.element)
        );

        // edit.task event is a custom event fired in SpiceContextPad class
        this.listenToDiagramEvent('edit.task', (event: BpmnDiagramEventI, element) =>
            this.openEditModal(element.businessObject.$attrs.taskId)
        );

        this.listenToDiagramEvent('drag.ended', () =>
            this.saveDiagramData()
        );
    }

    /**
     * handle the diagram element add
     * @private
     */
    private handleDiagramElementAdd(event: BpmnDiagramElementI) {
        if (event.type == 'label') return;

        if (this.replacingDiagramElement) {
            return this.replacingDiagramElement = false;
        }

        this.addTask(event);

        this.bpmnJS.get('canvas').zoom('fit-viewport');
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateTaskNameFromDiagram(event: BpmnDiagramEventI) {
        this.filteredTasks.some(task => {
            if (event.context.element.businessObject.$attrs.taskId == task.id) {
                task.name = event.context.newLabel;
                return true;
            }
        });
    }

    /**
     * set temporary the source task id and connect the tasks
     * @param element
     * @private
     */
    private handleDiagramConnectionAdd(element: BpmnDiagramElementI) {

        this.connectingSourceId = element.source.businessObject.$attrs.taskId;

        if (this.addingTask) return;

        this.connectTasks(
            element.source.businessObject.$attrs.taskId,
            this.tasks.find(t => t.id == element.target.businessObject.$attrs.taskId)
        );
    }

    /**
     * remove the connection in tasks
     * @param element
     * @private
     */
    private handleDiagramConnectionDelete(element: BpmnDiagramElementI) {

        this.tasks.some(task => {

            if (task.id != element.businessObject.sourceRef.$attrs.taskId) return false;

            const target = this.tasks.find(t => t.id == element.businessObject.targetRef.$attrs.taskId);
            const sourceTask = this.tasks.find(t => this.getTaskNextTasks(t).some(id => id == task.id));

            if (target) {
                this.deleteTaskNextTask(task, target.id);
            }

            if (sourceTask) {
                this.addTaskNextTask(sourceTask, target.id);
                this.deleteTaskNextTask(sourceTask, task.id);
            }
            return true;
        });
    }

    /**
     * open edit modal
     * @param taskId
     * @private
     */
    private openEditModal(taskId) {
        this.modal.openModal('WorkflowManagerTaskEditModal', true, this.injector).subscribe(ref => {
            ref.instance.task = this.filteredTasks.find(t => t.id == taskId);
            ref.instance.response.subscribe(taskData => {
                this.tasks = [...this.tasks.filter(t => t.id != taskData.id), taskData];
            });
        });
    }

    /**
     * get task next tasks
     * @param task
     * @private
     */
    private getTaskNextTasks(task): string[] | { id: string, name: string }[] {

        if (!task.type_config) return [];

        const isDecision = this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision';
        return (isDecision ? task.type_config.decisions : task.type_config.next_tasks) ?? [];
    }

    /**
     * delete a next task from a task
     * @param task
     * @param idToDelete
     * @private
     */
    private deleteTaskNextTask(task: WorkflowTaskDefinitionI, idToDelete: string) {

        if (!task.type_config) return;

        const isDecision = this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision';

        if (isDecision) {
            task.type_config.decisions = task.type_config.decisions.filter(d => d.id != idToDelete);
        } else {
            task.type_config.next_tasks = task.type_config.next_tasks.filter(id => id != idToDelete);
        }
    }

    /**
     * add a next task to a task
     * @param task
     * @param toAdd
     * @private
     */
    private addTaskNextTask(task, toAdd: any) {

        if (!task.type_config) task.type_config = {};

        const isDecision = this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision';

        const data = {
            configKey: isDecision ? 'decision' : 'next_tasks',
            item: isDecision ? {id: toAdd.id, name: toAdd.name} : toAdd.id
        };

        task.type_config[data.configKey] = [...task.type_config[data.configKey], data.item];
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
            const taskType = this.workflowManagerService.getType(task.tasktype).type;
            let elementType = 'bpmn:IntermediateThrowEvent';

            if (!!task.closetask) elementType = 'bpmn:EndEvent';
            if (!!task.primarytask) elementType = 'bpmn:StartEvent';

            if (taskType == 'gateway_event_based') elementType = 'bpmn:EventBasedGateway';
            if (taskType == 'gateway_decision') elementType = 'bpmn:ExclusiveGateway';

            if (elementType == element.type) return;

            const newElement = replace.replaceElement(element, {type: elementType});
            modeling.updateProperties(newElement, {taskId: task.id});
        });
    }

    /**
     * @return any[] all diagram elements
     * @private
     */
    private getAllDiagramElements(): any[] {
        return this.bpmnJS.get('elementRegistry').filter(e => this.diagramElementTypes.indexOf(e.type) > -1);
    }

    /**
     * update the diagram elements connection
     * @private
     */
    private updateDiagramElementsConnection() {

        const modeling = this.bpmnJS.get('modeling');
        const elements = this.getAllDiagramElements();

        this.filteredTasks.forEach(task => {

            const isDecision = this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision';

            if (!isDecision && !Array.isArray(task.type_config?.next_tasks) || (isDecision && !Array.isArray(task.type_config?.decisions))) return;

            let nextTaskElement;

            if (isDecision) {
                task.type_config.decisions.forEach(decision => {
                    nextTaskElement = elements.find(e => e.businessObject.$attrs.taskId == decision.id);
                });
            } else {
                task.type_config.next_tasks.forEach(nextTaskId => {
                    nextTaskElement = elements.find(e => e.businessObject.$attrs.taskId == nextTaskId);
                });
            }

            if (!nextTaskElement || nextTaskElement.businessObject.incoming.some(sequenceFlow => sequenceFlow.sourceRef.$attrs.taskId == task.id)) {
                return;
            }
            const taskElement = elements.find(e => e.businessObject.$attrs.taskId == task.id);
            modeling.connect(taskElement, nextTaskElement);
        });
    }

    /**
     * adjust task data from diagram element
     * @param newTask
     * @param diagramEvent
     * @private
     */
    private setTaskStartEndFromDiagram(newTask: WorkflowTaskDefinitionI, diagramEvent: BpmnDiagramElementI) {

        if (diagramEvent.type == 'bpmn:StartEvent') {
            newTask.primarytask = true;
        }

        if (diagramEvent.type == 'bpmn:EndEvent') {
            newTask.closetask = true;
        }

        this.saveDiagramData();
    }

    /**
     * assign next task from diagram
     * @private
     * @param sourceId
     * @param targetTask
     */
    private connectTasks(sourceId: string, targetTask: any) {

        this.filteredTasks.some(task => {
            if (sourceId == task.id) {

                if (!task.type_config) task.type_config = {};

                if (this.workflowManagerService.getType(task.tasktype).type == 'gateway_decision') {

                    task.type_config.decisions = [...(task.type_config.decisions ?? []), {
                        id: targetTask.id,
                        name: targetTask.name
                    }];

                } else {
                    task.type_config.next_tasks = [...(task.type_config.next_tasks ?? []), targetTask.id];
                }

                return true;
            }
        });
    }
}

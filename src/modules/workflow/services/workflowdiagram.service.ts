/**
 * @module ModuleWorkflow
 */
import {Injectable, OnDestroy} from '@angular/core';
import {SpicePalette} from "../../../include/bpmndiagram/SpicePalette";
import {diagramElementTypes, SpiceContextPad} from "../../../include/bpmndiagram/SpiceContextPad";
import {libloader} from "../../../services/libloader.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {BpmnDiagramElementI, BpmnDiagramEventI, WorkflowTaskDefinitionI} from "../interfaces/workflow.interfaces";
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
    private readonly diagramElementTypes: {taskType: string, bpmnType: string}[] = [];

    constructor(private libLoader: libloader,
                private model: model,
                private modal: modal,
                private workflowManagerService: WorkflowManagerService) {
        this.diagramElementTypes = diagramElementTypes;
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
     * destroy the diagram
     */
    public ngOnDestroy() {
        if (this.bpmnJS) {
            this.bpmnJS.destroy();
        }
    }

    /**
     * adjust the diagram element after adding the new task
     */
    public updateElementLabel(element: BpmnDiagramElementI, label: string) {

        this.bpmnJS.get('modeling').updateLabel(element, label);
    }

    /**
     * create the missing diagram elements from tasks
     */
    public createMissingDiagramElements() {

        if (!this.bpmnJS) return;


        const elements = this.getAllDiagramElements();

        this.workflowManagerService.filteredTasks.filter(t => !elements.some(e => e.businessObject.$attrs.taskId == t.id))
            .forEach(task => {
                this.createDiagramElement(task)
            });

        this.saveDiagramData();
    }

    /**
     * create new diagram instance
     */
    public loadDiagram() {

        this.libLoader.loadLib('bpmn-js').subscribe(res => {

            if (!res.loaded) return;

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
            .filter(e => !this.workflowManagerService.filteredTasks.some(t => t.id == e.businessObject.$attrs.taskId) || this.tasks.some(t => t.deleted == 1 && t.id == e.businessObject.$attrs.taskId));

        if (deleteElements.length == 0) return;

        this.bpmnJS.get('modeling').removeElements(deleteElements);
    }

    /**
     * update diagram elements label
     */
    public updateDiagramElementsLabel() {

        const modeling = this.bpmnJS.get('modeling');

        this.getAllDiagramElements().forEach(e => {

            const task = this.workflowManagerService.filteredTasks.find(task => e.businessObject.$attrs.taskId == task.id);

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

    private createDiagramElement(task: WorkflowTaskDefinitionI) {

        // todo adjust
        const elementRegistry = this.bpmnJS.get('elementRegistry');
        const modeling = this.bpmnJS.get('modeling');
        const elementFactory = this.bpmnJS.get('elementFactory');

        const type = this.diagramElementTypes.find(t => this.workflowManagerService.getType(task.tasktype).type == t.taskType).bpmnType ?? 'bpmn:IntermediateThrowEvent';
        const newShape = elementFactory.createShape({type});
        const process = elementRegistry.get('Process_1');

        modeling.updateProperties(newShape, {taskId: task.id});

        const tap = 100,
            x = (type == 'bpmn:StartEvent' ? tap : (tap * this.workflowManagerService.filteredTasks.length)) + tap,
            y = (tap * this.workflowManagerService.filteredTasks.length);
        modeling.createElements(newShape, {x, y}, process);
    }

    /**
     * listen to shape change
     * @private
     */
    private listenToShapeChange() {

        this.workflowManagerService.types.forEach(type =>
            this.listenToDiagramEvent(type.id, (event: BpmnDiagramEventI, element: BpmnDiagramElementI) =>
                this.handleDiagramElementAdd(element, event.type)
            )
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
            this.workflowManagerService.openEditModal(element.businessObject.$attrs.taskId)
        );

        this.listenToDiagramEvent('drag.ended', () =>
            this.saveDiagramData()
        );
    }

    /**
     * handle the diagram element add
     * @private
     */
    private handleDiagramElementAdd(element: BpmnDiagramElementI, type: string) {

        if (element.type == 'label') return;

        if (this.replacingDiagramElement) {
            return this.replacingDiagramElement = false;
        }


        const newTask = this.workflowManagerService.generateNewTask(type);
        this.addingTask = true;

        this.tasks = [...this.tasks, newTask];

        this.bpmnJS.get('modeling').updateProperties(element, {taskId: newTask.id});
        this.createDiagramElement(newTask);

        this.connectTasks(this.connectingSourceId, newTask);
        this.updateElementLabel(element, newTask.name);

        this.bpmnJS.get('modeling').updateProperties(element, {taskId: newTask.id});

        this.addingTask = false;
        this.connectingSourceId = undefined;

        this.bpmnJS.get('canvas').zoom('fit-viewport');
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateTaskNameFromDiagram(event: BpmnDiagramEventI) {
        this.workflowManagerService.filteredTasks.some(task => {
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
        this.updateDiagramElementsConnection();
        this.updateDiagramElementsLabel();
    }

    /**
     * @return any[] all diagram elements
     * @private
     */
    private getAllDiagramElements(): any[] {
        return this.bpmnJS.get('elementRegistry').filter(e => this.diagramElementTypes.some(t => t.bpmnType == e.type));
    }

    /**
     * update the diagram elements connection
     * @private
     */
    private updateDiagramElementsConnection() {

        const modeling = this.bpmnJS.get('modeling');
        const elements = this.getAllDiagramElements();

        this.workflowManagerService.filteredTasks.forEach(task => {

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
     * assign next task from diagram
     * @private
     * @param sourceId
     * @param targetTask
     */
    private connectTasks(sourceId: string, targetTask: any) {

        this.workflowManagerService.filteredTasks.some(task => {
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

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
        detach(),
        clear()
    };
    /**
     * holds the diagram listeners to remove them on destroy
     * @private
     */
    private diagramListeners: { event: string, listener: any }[] = [];
    /**
     * holds the diagram element types
     * @private
     */
    private readonly diagramElementTypes: { taskType: string, bpmnType: string, eventDefinitionType?: string }[] = [];

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
     * load the diagram data from the workflow tasks
     */
    public reloadDiagramData(activate?: boolean) {

        this.clearDiagramData();

        this.initializeDiagram().then(() => {
            this.updateDiagramFromTasks();
            if (activate) this.activate();
        });
    }

    /**
     * deactivate the listeners and clear the diagram
     */
    public clearDiagramData() {
        this.deactivate();
        this.bpmnJS.clear();
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
     * create new diagram instance and attach it to the container
     * @param container
     */
    public loadDiagram(container: HTMLElement) {

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

            this.bpmnJS.attachTo(container);
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
     */
    public activate() {
        this.updateDiagramFromTasks();
        this.listenToShapeChange();
    }

    /**
     * detach the diagram from the dom and remove all listeners
     */
    public deactivate() {
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
     * update the diagram from tasks data
     * @private
     */
    private updateDiagramFromTasks() {
        this.cleanupDiagramElements();
        this.createMissingDiagramElements();
        this.updateDiagramElementsLabel();
    }

    /**
     * cleanup diagram elements
     */
    private cleanupDiagramElements() {

        const deleteElements = this.getAllDiagramElements()
            .filter(e => !this.workflowManagerService.filteredTasks.some(t => t.id == e.businessObject.$attrs.taskId) || this.tasks.some(t => t.deleted == 1 && t.id == e.businessObject.$attrs.taskId));

        if (deleteElements.length == 0) return;

        this.bpmnJS.get('modeling').removeElements(deleteElements);
    }

    /**
     * create the missing diagram elements from tasks
     */
    private createMissingDiagramElements() {

        if (!this.bpmnJS) return;


        const elements = this.getAllDiagramElements();

        if (elements.length == this.workflowManagerService.filteredTasks.length) {
            return;
        }

        const startTask = this.workflowManagerService.filteredTasks.find(t => this.workflowManagerService.getType(t.tasktype).type == 'start');

        if (!startTask) return;

        const startElement = elements.find(e => e.businessObject.$attrs.taskId == startTask.id);

        if (!startElement) {
            const startElement = this.createDiagramElement(startTask);
            this.appendStartElement(startElement);
        }

        this.createProcessElements(startTask);

        this.saveDiagramData();
    }

    /**
     * create the start diagram element
     * @param element
     * @private
     */
    private appendStartElement(element: BpmnDiagramElementI) {
        const elementRegistry = this.bpmnJS.get('elementRegistry');
        const modeling = this.bpmnJS.get('modeling');

        const process = elementRegistry.get('Process_1');

        const tap = 150;

        modeling.createElements(element, {x: tap, y: tap}, process);
    }

    /**
     * create the start diagram element
     * @private
     * @param source
     * @param element
     */
    private appendElement(source: BpmnDiagramElementI, element: BpmnDiagramElementI) {
        const autoPlace = this.bpmnJS.get('autoPlace');
        autoPlace.append(source, element);
    }

    /**
     * recursively creating the missing process elements
     * @param task
     * @private
     */
    private createProcessElements(task: WorkflowTaskDefinitionI) {

        const allElements = this.getAllDiagramElements();
        const sourceElement = allElements.find(e => e.businessObject.$attrs.taskId == task.id);

        this.workflowManagerService.getTaskNextTasks(task).forEach(entry => {
            const nextTask = this.workflowManagerService.getTaskObject(entry.id);
            if (!allElements.some(e => e.businessObject.$attrs.taskId == nextTask.id)) {
                const newElement = this.createDiagramElement(nextTask);
                this.appendElement(sourceElement, newElement);
            }
            this.createProcessElements(nextTask);
        });
    }

    /**
     * create diagram element from task
     * @param task
     * @private
     */
    private createDiagramElement(task: WorkflowTaskDefinitionI): BpmnDiagramElementI {

        const elementFactory = this.bpmnJS.get('elementFactory');
        const modeling = this.bpmnJS.get('modeling');

        const type = this.diagramElementTypes.find(t => this.workflowManagerService.getType(task.tasktype).type == t.taskType) ?? {bpmnType: 'bpmn:IntermediateThrowEvent', eventDefinitionType: undefined};

        const newElement = elementFactory.createShape({type: type.bpmnType, eventDefinitionType: type.eventDefinitionType});

        modeling.updateProperties(newElement, {taskId: task.id});

        return newElement;
    }

    /**
     * initialize the diagram content
     * @private
     */
    private initializeDiagram(): Promise<any> {

        const diagramData = this.model.getField('diagram_data');

        if (!diagramData) {
            return this.bpmnJS.createDiagram().then(() =>
                this.bpmnJS.get('modeling').removeElements([
                    this.bpmnJS.get('elementRegistry').get('StartEvent_1')
                ]));
        } else {
            const xml = diagramData.replaceAll('\n', '');
            return this.bpmnJS.importXML(xml);
        }
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

        this.listenToDiagramEvent('shape.added', (event: BpmnDiagramEventI) =>
            this.updateDiagramElementLabel(event.element)
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

        const newTask = this.workflowManagerService.generateNewTask(type);
        const modeling = this.bpmnJS.get('modeling');

        this.tasks = [...this.tasks, newTask];

        modeling.updateProperties(element, {taskId: newTask.id});
        this.bpmnJS.get('canvas').zoom('fit-viewport');
    }

    /**
     * update diagram element label
     * @private
     */
    private updateDiagramElementLabel(element: BpmnDiagramElementI) {

        const modeling = this.bpmnJS.get('modeling');

        const task = this.workflowManagerService.filteredTasks.find(task => element.businessObject.$attrs.taskId == task.id);

        if (!task) return;

        window.setTimeout(() => modeling.updateLabel(element, task.name));
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
            const sourceTask = this.tasks.find(t => this.workflowManagerService.getTaskNextTasks(t).some(entry => entry.id == task.id));

            if (target) {
                this.workflowManagerService.deleteTaskNextTask(task, target.id);
            }

            if (sourceTask) {
                this.addTaskNextTask(sourceTask, target.id);
                this.workflowManagerService.deleteTaskNextTask(sourceTask, task.id);
            }
            return true;
        });
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
     * @return any[] all diagram elements
     * @private
     */
    private getAllDiagramElements(): BpmnDiagramElementI[] {
        return this.bpmnJS.get('elementRegistry').filter(e => this.diagramElementTypes.some(t => t.bpmnType == e.type));
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

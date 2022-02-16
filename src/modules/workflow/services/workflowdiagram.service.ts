/**
 * @module ModuleWorkflow
 */
import {Injectable, OnDestroy} from '@angular/core';
import {SpicePalette} from "../../../include/bpmndiagram/SpicePalette";
import {elementTypes, SpiceContextPad} from "../../../include/bpmndiagram/SpiceContextPad";
import {libloader} from "../../../services/libloader.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {BpmnElementI, BpmnEventI, WorkflowTaskDefI} from "../interfaces/workflow.interfaces";
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
    private readonly elementTypes: { taskType: string, bpmnType: string, eventDefinitionType?: string }[] = [];

    constructor(private libLoader: libloader,
                private model: model,
                private modal: modal,
                private wfm: WorkflowManagerService) {
        this.elementTypes = elementTypes;
    }

    /**
     * @return boolean if the diagram library was loaded
     */
    get isLoaded(): boolean {
        return !!this.bpmnJS;
    }

    /**
     * @return [] the workflow tasks without deleted
     */
    get tasks(): WorkflowTaskDefI[] {
        return this.model.data.tasks;
    }

    set tasks(data: WorkflowTaskDefI[]) {
        this.model.data.tasks = data;
        this.wfm.sortTasksBySequence(data);
    }

    /**
     * @return [] the workflow tasks with deleted
     */
    get allTasks(): WorkflowTaskDefI[] {
        return this.model.data.tasks.concat(this.wfm.deletedTasks);
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
    public reloadDiagram(activate?: boolean) {

        this.clearDiagram();

        this.initializeDiagram().then(() => {
            this.updateDiagramFromTasks();
            if (activate) this.activate();
        });
    }

    /**
     * deactivate the listeners and clear the diagram
     */
    public clearDiagram() {
        this.deactivate();
        this.bpmnJS.clear();
    }

    /**
     * update diagram elements label
     */
    public updateElementsLabel() {

        const modeling = this.bpmnJS.get('modeling');

        this.getAllElements().forEach(e => {

            const task = this.tasks.find(task => e.businessObject.$attrs.taskId == task.id);

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

            SpiceContextPad.taskTypes = this.wfm.types;

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
        this.removeAllListeners();
    }

    /**
     * set the task related to the diagram element to deleted
     */
    public handleDiagramElementDelete(element: BpmnElementI) {
        this.tasks.some(task => {
            if (element.businessObject.$attrs.taskId == task.id) {
                this.wfm.deleteTask(task.id);
                return true;
            }
        });
    }

    /**
     * update the diagram from tasks data
     * @private
     */
    private updateDiagramFromTasks() {

        if (!this.bpmnJS) return;

        this.updateElements();
        this.updateConnections();
        this.updateElementsLabel();
    }

    /**
     * cleanup diagram elements
     */
    private cleanupElements() {

        const deleteElements = this.getAllElements()
            .filter(e => !this.tasks.some(t => t.id == e.businessObject.$attrs.taskId) || this.wfm.deletedTasks.some(t => t.id == e.businessObject.$attrs.taskId));

        if (deleteElements.length == 0) return;

        this.bpmnJS.get('modeling').removeElements(deleteElements);
    }

    /**
     * cleanup diagram elements and create the missing once
     */
    private updateElements() {

        this.cleanupElements();

        const elements = this.getAllElements();

        if (elements.length == this.tasks.length) {
            return;
        }

        const startTask = this.tasks.find(t => this.wfm.getType(t.tasktype).type == 'start');

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
     * update the diagram elements connections
     * @private
     */
    private updateConnections() {

        this.cleanupConnections();

        const modeling = this.bpmnJS.get('modeling');
        const elements = this.getAllElements();

        this.wfm.tasks.forEach(task => {

            const element = elements.find(e => e.businessObject.$attrs.taskId == task.id);
            const nextTasks = this.wfm.getTaskNextTasks(task);

            nextTasks.forEach(nextTask => {

                const nextElement = elements.find(e => e.businessObject.$attrs.taskId == nextTask.id);

                if (nextElement.businessObject.incoming.some(sequenceFlow => sequenceFlow.sourceRef.$attrs.taskId == task.id)) {
                    return;
                }

                modeling.connect(element, nextElement);
            });


        });
    }

    /**
     * cleanup element connections
     * @private
     */
    private cleanupConnections() {

        const connections = this.bpmnJS.get('elementRegistry').filter(e => this.elementTypes.some(t => 'bpmn:SequenceFlow' == e.type));

        connections.forEach(sequenceFlow => {

            const previousTask = this.tasks.find(t => sequenceFlow.source.businessObject.$attrs.taskId == t.id);
            const nextTasks = this.wfm.getTaskNextTasks(previousTask);

            if (!nextTasks.some(e => e.id == sequenceFlow.target.businessObject.$attrs.taskId)) {
                this.bpmnJS.get('modeling').removeConnection(sequenceFlow);
            }
        });
    }

    /**
     * create the start diagram element
     * @param element
     * @private
     */
    private appendStartElement(element: BpmnElementI) {
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
    private appendElement(source: BpmnElementI, element: BpmnElementI) {
        const autoPlace = this.bpmnJS.get('autoPlace');
        autoPlace.append(source, element);
    }

    /**
     * recursively creating the missing process elements
     * @param task
     * @private
     */
    private createProcessElements(task: WorkflowTaskDefI) {

        const allElements = this.getAllElements();
        const sourceElement = allElements.find(e => e.businessObject.$attrs.taskId == task.id);

        this.wfm.getTaskNextTasks(task).forEach(entry => {
            const nextTask = this.wfm.getTaskObject(entry.id);
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
    private createDiagramElement(task: WorkflowTaskDefI): BpmnElementI {

        const elementFactory = this.bpmnJS.get('elementFactory');
        const modeling = this.bpmnJS.get('modeling');

        const type = this.elementTypes.find(t => this.wfm.getType(task.tasktype).type == t.taskType) ?? {
            bpmnType: 'bpmn:IntermediateThrowEvent',
            eventDefinitionType: undefined
        };

        const newElement = elementFactory.createShape({
            type: type.bpmnType,
            eventDefinitionType: type.eventDefinitionType
        });

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

        this.wfm.types.forEach(type =>
            this.listenToDiagramEvent(type.id, (event: BpmnEventI, element: BpmnElementI) =>
                this.handleDiagramElementAdd(element, event.type)
            )
        );

        this.listenToDiagramEvent('shape.added', (event: BpmnEventI) =>
            this.updateDiagramElementLabel(event.element)
        );

        this.listenToDiagramEvent('commandStack.element.updateLabel.preExecute', (event: BpmnEventI) =>
            this.updateTaskNameFromDiagram(event)
        );

        this.listenToDiagramEvent('shape.removed', (event: BpmnEventI) =>
            this.handleDiagramElementDelete(event.element)
        );

        this.listenToDiagramEvent('connection.changed', (event: BpmnEventI) =>
            this.handleDiagramConnectionChange(event.element)
        );

        this.listenToDiagramEvent('connection.removed', (event: BpmnEventI) =>
            this.handleDiagramConnectionDelete(event.element)
        );

        // edit.task event is a custom event fired in SpiceContextPad class
        this.listenToDiagramEvent('edit.task', (event: BpmnEventI, element) =>
            this.wfm.openEditModal(element.businessObject.$attrs.taskId)
        );

        this.listenToDiagramEvent('drag.ended', () =>
            this.saveDiagramData()
        );
    }

    /**
     * handle the diagram element add
     * @private
     */
    private handleDiagramElementAdd(element: BpmnElementI, type: string) {

        if (element.type == 'label') return;

        const newTask = this.wfm.generateNewTask(type);
        const modeling = this.bpmnJS.get('modeling');

        this.tasks = [...this.tasks, newTask];

        modeling.updateProperties(element, {taskId: newTask.id});
        this.bpmnJS.get('canvas').zoom('fit-viewport');
    }

    /**
     * update diagram element label
     * @private
     */
    private updateDiagramElementLabel(element: BpmnElementI) {

        const modeling = this.bpmnJS.get('modeling');

        const task = this.tasks.find(task => element.businessObject.$attrs.taskId == task.id);

        if (!task) return;

        window.setTimeout(() => modeling.updateLabel(element, task.name));
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateTaskNameFromDiagram(event: BpmnEventI) {
        this.tasks.some(task => {
            if (event.context.element.businessObject.$attrs.taskId == task.id) {
                task.name = event.context.newLabel;
                return true;
            }
        });
    }

    /**
     * set temporary the source task id and connect the tasks
     * @param sequenceFlow
     * @private
     */
    private handleDiagramConnectionChange(sequenceFlow: BpmnElementI) {

        this.cleanupNextTasks();

        this.connectTasks(
            sequenceFlow.source.businessObject.$attrs.taskId,
            this.tasks.find(t => t.id == sequenceFlow.target.businessObject.$attrs.taskId)
        );
    }

    /**
     * cleanup tasks next tasks
     * @private
     */
    private cleanupNextTasks() {

        const connections = this.bpmnJS.get('elementRegistry').filter(e => this.elementTypes.some(t => 'bpmn:SequenceFlow' == e.type));

        this.tasks.forEach(task => {

            this.wfm.getTaskNextTasks(task).forEach(entry => {

                if (connections.some(c => c.source.businessObject.$attrs.taskId == task.id && c.target.businessObject.$attrs.taskId == entry.id)) {
                    return;
                }
                this.wfm.deleteTaskNextTask(task, entry.id);
            });
        })
    }

    /**
     * remove the connection in tasks
     * @param sequenceFlow
     * @private
     */
    private handleDiagramConnectionDelete(sequenceFlow: BpmnElementI) {

        const sourceTask = this.allTasks.find(t => t.id == sequenceFlow.businessObject.sourceRef.$attrs.taskId);
        const targetTask = this.allTasks.find(t => t.id == sequenceFlow.businessObject.targetRef.$attrs.taskId);

        if (!sourceTask || !targetTask) return;

        this.wfm.deleteTaskNextTask(sourceTask, targetTask.id);
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
    private removeAllListeners() {
        const eventBus = this.bpmnJS.get('eventBus');

        this.diagramListeners.forEach(e => eventBus.off(e.event, e.listener));
        this.diagramListeners = [];
    }

    /**
     * @return any[] all diagram elements
     * @private
     */
    private getAllElements(): BpmnElementI[] {
        return this.bpmnJS.get('elementRegistry').filter(e => this.elementTypes.some(t => t.bpmnType == e.type));
    }

    /**
     * assign next task from diagram
     * @private
     * @param sourceId
     * @param targetTask
     */
    private connectTasks(sourceId: string, targetTask: any) {

        this.tasks.some(task => {
            if (sourceId == task.id) {

                if (!task.type_config) task.type_config = {};

                if (this.wfm.getTaskNextTasks(task).some(t => t.id == targetTask.id)) {
                    return;
                }
                this.wfm.appendTaskNextTask(task, targetTask);

                return true;
            }
        });
    }
}

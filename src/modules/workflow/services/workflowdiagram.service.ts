/**
 * @module ModuleWorkflow
 */
import {Injectable, OnDestroy} from '@angular/core';
import {libloader} from "../../../services/libloader.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {BpmnElementI, BpmnEventI, WorkflowTaskDefI} from "../interfaces/workflow.interfaces";
import {WorkflowManagerService} from "./workflowmanager.service";
import {asapScheduler} from "rxjs";

/** @ignore */
declare var BpmnJS, SpiceBpmnModules;

/**
 * provide bpmn-js library instance and api
 */
@Injectable()
export class WorkflowDiagramService implements OnDestroy {
    /**
     * holds the element types
     */
    public elementTypes: {taskType: string, bpmnType: string, eventDefinitionType?: string}[] = [
        {taskType: 'regular' , bpmnType: 'bpmn:IntermediateThrowEvent'},
        {taskType: 'end' , bpmnType: 'bpmn:EndEvent'},
        {taskType: 'start' , bpmnType: 'bpmn:StartEvent'},
        {taskType: 'gateway_decision' , bpmnType: 'bpmn:ExclusiveGateway'},
        {taskType: 'gateway_email_event' , bpmnType: 'bpmn:IntermediateThrowEvent'},
        {taskType: 'email_event_open' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:MessageEventDefinition'},
        {taskType: 'email_event_bounce' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:SignalEventDefinition'},
        {taskType: 'email_event_handle' , bpmnType: 'bpmn:IntermediateThrowEvent'},
        {taskType: 'email_event_opt_out' , bpmnType: 'bpmn:IntermediateThrowEvent'},
        {taskType: 'timer' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:TimerEventDefinition'},
    ];

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
        clear(),
        saveSVG(obj: any, fn: (error, svg) => void),
    };
    /**
     * holds the diagram listeners to remove them on destroy
     * @private
     */
    private diagramListeners: { event: string, listener: any }[] = [];

    constructor(private libLoader: libloader,
                private model: model,
                private modal: modal,
                private wfm: WorkflowManagerService) {
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

        this.updateConnectionsLabels();
    }

    /**
     * update all connections labels
     * @private
     */
    private updateConnectionsLabels() {

        const modeling = this.bpmnJS.get('modeling');

        const connections = this.getAllConnections();

        this.tasks.filter(t => ['gateway_decision', 'email_event_handle'].indexOf(this.wfm.getType(t.tasktype).type) > -1).forEach(t => {
            this.wfm.getTaskNextTasks(t).forEach(entry => {
                const connection = connections.find(c => c.source.businessObject.$attrs.taskId == t.id && c.target.businessObject.$attrs.taskId == entry.id);
                if (!connection) return;
                modeling.updateLabel(connection, entry.name);
            });
        });
    }

    /**
     * create new diagram instance and attach it to the container
     * @param container
     */
    public loadDiagram(container: HTMLElement) {

        this.libLoader.loadLib('bpmn-js').subscribe(res => {

            if (!res.loaded) return;

            SpiceBpmnModules.spiceContextPad.taskTypes = this.wfm.types;
            SpiceBpmnModules.spiceContextPad.elementTypes = this.elementTypes;

            this.bpmnJS = new BpmnJS({
                keyboard: { bindTo: document },
                moddleExtensions: {
                    spice: {
                        name: 'WorkflowTask', prefix: 'spice', xml: {'tagAlias': 'lowerCase'},
                        types: [{
                            name: 'WorkflowTaskDetails', superClass: ['Element'],
                            properties: [
                                {name: 'taskId', isAttr: true, type: 'String'},
                                {name: 'icon', isAttr: true, type: 'String'},
                                {name: 'taskType', isAttr: true, type: 'String'}
                            ]
                        }]
                    }
                },
                additionalModules: [
                    SpiceBpmnModules.init]
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

        this.removeAllListeners();

        this.updateElements();
        this.updateConnections();
        this.updateElementsLabel();

        this.listenToShapeChange();
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

        this.getAllConnections().forEach(sequenceFlow => {

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
        const taskType = this.wfm.getType(task.tasktype);

        const type = this.elementTypes.find(t => taskType.type == t.taskType) ?? {
            bpmnType: 'bpmn:IntermediateThrowEvent',
            eventDefinitionType: undefined
        };

        const newElement = elementFactory.createShape({
            type: type.bpmnType,
            eventDefinitionType: type.eventDefinitionType
        });

        modeling.updateProperties(newElement, {
            taskId: task.id,
            icon: taskType.icon,
            taskType: taskType.type
        });

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

        this.removeAllListeners();

        this.wfm.types.forEach(type =>
            this.listenToDiagramEvent(type.id, (event: BpmnEventI, element: BpmnElementI) =>
                this.handleDiagramElementAdd(element, event.type)
            )
        );

        this.listenToDiagramEvent('shape.added', (event: BpmnEventI) => {
            this.updateDiagramElementLabel(event.element);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('commandStack.element.updateLabel.preExecute', (event: BpmnEventI) => {
            this.updateTaskLabels(event);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('shape.removed', (event: BpmnEventI) => {
            this.handleDiagramElementDelete(event.element);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('connection.changed', (event: BpmnEventI) => {
            this.handleDiagramConnectionChange(event.element);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('connection.removed', (event: BpmnEventI) => {
            this.handleDiagramConnectionDelete(event.element);
            this.saveDiagramData();
        });

        // edit.task event is a custom event fired in SpiceContextPad class
        this.listenToDiagramEvent('edit.task', (event: BpmnEventI, element) =>
            this.wfm.openEditModal(element.businessObject.$attrs.taskId).subscribe(() =>
                this.updateDiagramFromTasks()
               )
        );

        this.listenToDiagramEvent('drag.ended', () =>
            this.saveDiagramData()
        );
    }

    /**
     * save the diagram as svg
     */
    public saveAsSVG() {

        this.bpmnJS.saveSVG({ format: true }, (error, svg) => {
            if (error) {
                return;
            }

            const svgBlob = new Blob([svg], {
                type: 'image/svg+xml'
            });

            const fileName = this.model.data.name + '.svg';

            const downloadLink = document.createElement('a');
            downloadLink.download = fileName;
            downloadLink.href = window.URL.createObjectURL(svgBlob);
            downloadLink.onclick = (event: MouseEvent) => {
                document.body.removeChild(event.target as Node);
            };
            downloadLink.style.visibility = 'hidden';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
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
        const typeObject = this.wfm.getType(type);

        modeling.updateProperties(element, {
            taskId: newTask.id,
            icon: typeObject.icon,
            taskType: typeObject.type
        });

        asapScheduler.schedule(() => this.updateConnectionsLabels());

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

        asapScheduler.schedule(() => modeling.updateLabel(element, task.name));
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateTaskLabels(event: BpmnEventI) {

        const isConnection = event.context.element.businessObject.$type == 'bpmn:SequenceFlow';
        const id = isConnection ? event.context.element.businessObject.sourceRef.$attrs.taskId : event.context.element.businessObject.$attrs.taskId;
        const target = isConnection ? event.context.element.businessObject.targetRef.$attrs.taskId : id;

        this.tasks.forEach(task => {

            if (!isConnection && id == task.id) {
                task.name = event.context.newLabel;
            } else {

                if (isConnection && task.id != id) return;

                this.wfm.getTaskNextTasks(task).some(entry => {
                    if (entry.id != target) return false;
                    entry.name = event.context.newLabel;
                });
            }
        });
    }

    /**
     * set temporary the source task id and connect the tasks
     * @param sequenceFlow
     * @private
     */
    private handleDiagramConnectionChange(sequenceFlow: BpmnElementI) {

        if (sequenceFlow.target.type == 'bpmn:TextAnnotation') return;

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

        const connections = this.getAllConnections();

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
     * @return any[] all diagram connections
     * @private
     */
    private getAllConnections(): BpmnElementI[] {
        return this.bpmnJS.get('elementRegistry').filter(e => this.elementTypes.some(t => 'bpmn:SequenceFlow' == e.type));
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

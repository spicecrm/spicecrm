import {Injectable, OnDestroy, signal} from '@angular/core';
import {libloader} from "../../../services/libloader.service";
import {asapScheduler, firstValueFrom, Subject} from "rxjs";
import {
    BpmnElementI,
    BpmnEventI,
    BpmnInstanceI,
    DiagramItemChangeI,
    DiagramItemI,
    DiagramLinkChangeI,
    DiagramNextItemI,
    DiagramOptionsI
} from "../interfaces/spicediagrams.interfaces";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";

declare var BpmnJS, SpiceBpmnModules;

@Injectable()
export class SpiceDiagramService implements OnDestroy {
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
     * the module to be used for editing
     */
    public module: string;

    /**
     * holds the diagram
     * @private
     */
    public bpmnJS: BpmnInstanceI;
    /**
     * holds the diagram listeners to remove them on destroy
     * @private
     */
    private diagramListeners: { event: string, listener: any }[] = [];
    /**
     * holds the diagram items
     * @private
     */
    private items: DiagramItemI[] = [];
    /**
     * holds the diagram types
     * @private
     */
    public types = [];
    /**
     * emit on item delete
     */
    public latestDeletedItemId = signal<string>(undefined);
    /**
     * holds the lastest created item
     */
    public latestCreatedItem = signal<DiagramItemI>(undefined);
    /**
     * holds the lastest created link between two items
     */
    public latestLinkChange = signal<DiagramLinkChangeI>(undefined);
    /**
     * holds the lastest created link between two items
     */
    public latestItemChange = signal<DiagramItemChangeI>(undefined);
    /**
     * holds the diagram data
     */
    public diagramData = signal<{svg: string, xml: string}>(undefined);
    /**
     * temporarily hold the type id after drag start or click from the palette and wait until the shape.added event is fired
     * @private
     */
    private currentAddingTypeId: string;
    /**
     * temporarily hold the item id after drag start or click from the palette and wait until the shape.added event is fired
     * @private
     */
    private currentAddingItem: { id: string; name: string, description?: string };
    /**
     * while changing the item type in the diagram, ignore handling the 'add' and 'delete' events
     * @private
     */
    private isChangingItemTypeId: string;

    constructor(private libLoader: libloader,
                private metadata: metadata,
                private model: model) {
    }

    /**
     * @return boolean if custom types array is passed
     */
    get hasCustomTypes(): boolean {
        return this.types.length > 0;
    }

    /**
     * @return boolean if the diagram library was loaded
     */
    get isLoaded(): boolean {
        return !!this.bpmnJS;
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
     * set the items for the diagram
     * @param items
     */
    public setItems(items: DiagramItemI[]) {
        this.items = items;
    }

    /**
     * load the diagram data from the workflow tasks
     */
    public loadData(xml: string) {

        if (!this.isLoaded) return;

        this.clearDiagram();

        this.createDiagram(xml).then(() => {
            this.activate();
            this.bpmnJS.get('canvas').zoom('fit-viewport');
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
     * get item next items
     * @param item
     * @private
     */
    private getItemNextItems(item: DiagramItemI): DiagramNextItemI[] {
        return item.nextItems;
    }

    /**
     * create new diagram instance and attach it to the container
     * @param container
     * @param options
     */
    public initialize(container: HTMLElement, options?: DiagramOptionsI) {

        const resSubject = new Subject<boolean>();
        firstValueFrom(this.libLoader.loadLib('bpmn-js')).then(
            res => {

                if (!res.loaded) {
                    resSubject.next(false);
                    return;
                }

                SpiceBpmnModules.spiceContextPad.taskTypes = this.types;
                SpiceBpmnModules.spiceContextPad.elementTypes = this.elementTypes;

                if (!options?.hideCreateItemButtonsInPalette) {
                    SpiceBpmnModules.spicePalette.taskTypes = this.types;
                    SpiceBpmnModules.spicePalette.elementTypes = this.elementTypes;
                }

                this.bpmnJS = new BpmnJS({
                    keyboard: {bindTo: container},
                    moddleExtensions: {
                        spice: {
                            name: 'SpiceDiagram', prefix: 'spice', xml: {'tagAlias': 'lowerCase'},
                            types: [{
                                name: 'SpiceDiagramDetails', superClass: ['Element'],
                                properties: [
                                    {name: 'taskId', isAttr: true, type: 'String'},
                                    {name: 'icon', isAttr: true, type: 'String'},
                                    {name: 'taskType', isAttr: true, type: 'String'}
                                ]
                            }]
                        }
                    },
                    additionalModules: [SpiceBpmnModules.init]
                });

                this.bpmnJS.attachTo(container);

                resSubject.next(true);
            }
        ).finally(
            () => resSubject.complete()
        );

        return resSubject.asObservable();
    }

    /**
     * save diagram XML data to the workflow field
     */
    public saveDiagramData() {
        this.bpmnJS.saveXML().then(
            data => {
                if (data.xml == this.diagramData()?.xml) return undefined;
                return data.xml;
            }).then(xml => {
                if (!xml) return;
            this.bpmnJS.saveSVG().then(data => {

                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(data.svg, 'image/svg+xml');

                const allElements = this.bpmnJS.get('elementRegistry').filter((e: BpmnElementI) => !!e.businessObject?.$attrs?.taskId && e.type != 'label');

                allElements.forEach((element: BpmnElementI) => {

                    const svgElement = svgDoc.querySelector(`g[data-element-id="${element.id}"]`);

                    if (svgElement) {
                        svgElement.setAttribute('data-task-id', element.businessObject.$attrs.taskId);
                    }
                });

                const newSvgString = new XMLSerializer().serializeToString(svgDoc);

                const svg = 'data:image/svg+xml;base64,' + btoa(newSvgString);

                this.diagramData.set({xml, svg});
            });
        });
    }

    /**
     * attach the diagram to its container and listen to its events
     */
    public activate() {
        this.listenToShapeChange();
    }

    /**
     * detach the diagram from the dom and remove all listeners
     */
    public deactivate() {
        this.removeAllListeners();
    }

    /**
     * set the item related to the diagram element to delete and emit
     */
    public handleDeleteDiagramElement(element: BpmnElementI) {

        const item = this.items.find(i => element.businessObject.$attrs.taskId == i.id);

        if (!item) return;

        this.latestDeletedItemId.set(item.id);
    }

    /**
     * initialize the diagram content
     * @private
     */
    private createDiagram(xml: string): Promise<any> {

        if (!xml) {
            return this.bpmnJS.createDiagram().then(() =>
                this.bpmnJS.get('modeling').removeElements([
                    this.bpmnJS.get('elementRegistry').get('StartEvent_1')
                ]));
        } else {
            xml = (xml as any).replaceAll('\n', '');
            return this.bpmnJS.importXML(xml);
        }
    }

    /**
     * listen to shape change
     * @private
     */
    private listenToShapeChange() {

        this.removeAllListeners();

        // listen to the create-start event of all the custom tasks and set the current id to be saved as element attribute
        if (this.hasCustomTypes) {
            this.types.forEach(type =>
                this.listenToDiagramEvent(type.id, () =>
                    this.currentAddingTypeId = type.id
                )
            );
        }

        this.listenToDiagramEvent('commandStack.shape.create.postExecute', (event: BpmnEventI) => {
            this.handleAddDiagramElement(event.context.shape);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('commandStack.shape.replace.preExecute', (event: BpmnEventI) => {
            this.handleBeforeDiagramElementTypeChange(event);
        });

        this.listenToDiagramEvent('commandStack.shape.replace.postExecute', (event: BpmnEventI) => {
            this.handleAfterDiagramElementTypeChange(event);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('commandStack.element.updateLabel.postExecute', (event: BpmnEventI) => {
            this.updateItemDisplayLabels(event);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('shape.color.changed', () => {
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('shape.removed', (event: BpmnEventI) => {
            // delay emitting the change to ensure the changes are detected for bulk delete action
            asapScheduler.schedule(() =>
                this.handleDeleteDiagramElement(event.element), 5
            );
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('connection.changed', (event: BpmnEventI) => {
            this.handleChangeDiagramConnection(event.element);
            this.saveDiagramData();
        });

        this.listenToDiagramEvent('connection.removed', (event: BpmnEventI) => {
            this.handleDeleteDiagramConnection(event.element);
            this.saveDiagramData();
        });

        // edit.task event is a custom event fired in SpiceContextPad class
        this.listenToDiagramEvent('edit.task', (_, element) =>
            this.openEditModal(element.businessObject.$attrs.taskId).subscribe(action => {
                if (action != 'save') return;
                this.updateDiagramElementLabel(element, this.model.getField('name'));
                this.saveDiagramData();
            })
        );

        this.listenToDiagramEvent('drag.ended', () =>
            this.saveDiagramData()
        );
    }

    /**
     * open edit modal
     * @param itemId
     */
    public openEditModal(itemId: string) {
        this.setCurrentEditingModel(itemId);
        const componentsetId = this.metadata.getComponentConfig('SpiceDiagram').editComponentset;
        return this.model.edit(false, componentsetId);
    }

    /**
     * set the current editing model to be used in the edit modal
     * @param id
     * @private
     */
    private setCurrentEditingModel(id: string) {
        this.model.reset();
        this.model.module = this.module;
        this.model.id = id;
        this.model.setData(this.items.find(i => i.id == id).data);
    }

    /**
     * generate new item
     * @private
     * @param bpmnTypeOrId
     */
    private generateNewItem(bpmnTypeOrId: string): DiagramItemI {
        this.model.reset();
        this.model.module = this.module;

        if (this.currentAddingItem) {
            this.model.id = this.currentAddingItem.id;
        }

        this.model.initialize();

        this.model.setFields({
            name: this.currentAddingItem?.name ?? 'new item ' + (this.items.length + 1),
            description: this.currentAddingItem?.description
        });

        const data = this.model.data;

        return {
            id: this.model.id,
            name: this.model.getField('name'),
            type: bpmnTypeOrId,
            nextItems: [],
            data: data
        };
    }

    /**
     * extract the element type and append the subtype too
     * @param element
     * @private
     */
    private getElementType(element: BpmnElementI): string {
        if (element.businessObject.eventDefinitions?.length == 1) {
            return element.type += '::' + element.businessObject.eventDefinitions[0].$type;
        } else {
            return element.type;
        }
    }

    /**
     * handle the diagram element add
     * @private
     */
    private handleAddDiagramElement(element: BpmnElementI) {

        const isItem = !['bpmn:Participant', 'label', 'bpmn:Group', 'bpmn:Lane', 'bpmn:TextAnnotation', 'bpmn:SubProcess'].includes(element.type);

        if (!isItem || this.isChangingItemTypeId) return;

        const bpmnTypeOrId = this.hasCustomTypes ? this.currentAddingTypeId : this.getElementType(element);
        const newItem = this.generateNewItem(bpmnTypeOrId);

        const modeling = this.bpmnJS.get('modeling');

        this.items = [...this.items, newItem];

        const attributes: any = {taskId: newItem.id};

        // for custom types set the type attributes on the element
        if (this.hasCustomTypes) {
            const typeObject = this.types.find(t => t.id == this.currentAddingTypeId);
            attributes.icon = typeObject.icon;
            attributes.taskType = typeObject.type;
        }

        modeling.updateProperties(element, attributes);

        this.updateDiagramElementLabel(element, newItem.name);

        this.bpmnJS.get('canvas').zoom('fit-viewport');
        this.latestCreatedItem.set(newItem);

    }

    /**
     * only if no custom types are used adjust the item type and emit
     * the bpmn type change triggers the 'create' and 'delete' events
     * to prevent creating a new item on type change; the id reference to the item on the old shape is removed
     * @param event
     * @private
     */
    private handleBeforeDiagramElementTypeChange(event: BpmnEventI) {

        if (this.hasCustomTypes) return;

        // to prevent deleting an item on type change, remove the id reference from the old shape
        const oldItem = this.items.find(item => item.id == event.context.oldShape.businessObject.$attrs.taskId);

        const modeling = this.bpmnJS.get('modeling');
        modeling.updateProperties(event.context.oldShape, {taskId: null, replacedShapeRefId: oldItem.id});

        this.isChangingItemTypeId = oldItem.id;

        // update the existing item type from the new shape and emit the change
        oldItem.type = event.context.newData.type;

        if (event.context.newData.eventDefinitionType) {
            oldItem.type += '::' + event.context.newData.eventDefinitionType;
        }

        this.latestItemChange.set({
            id: oldItem.id,
            type: oldItem.type,
            name: oldItem.name
        });
    }

    /**
     * after changing the type of the diagram element, set the reference id on the newly created shape
     * and reset the isChangingItemTypeId value
     * @param event
     * @private
     */
    private handleAfterDiagramElementTypeChange(event: BpmnEventI) {

        const modeling = this.bpmnJS.get('modeling');
        modeling.updateProperties(event.context.newShape, {taskId: this.isChangingItemTypeId});

        this.isChangingItemTypeId = undefined;
    }

    /**
     * update diagram element label
     * @private
     */
    private updateDiagramElementLabel(element: BpmnElementI, label: string) {

        const modeling = this.bpmnJS.get('modeling');
        modeling.updateLabel(element, label);
    }

    /**
     * update the task name from the diagram shape label
     * @param event
     * @private
     */
    private updateItemDisplayLabels(event: BpmnEventI) {

        if (!event.context.newLabel) return;

        const isConnection = event.context.element.businessObject.$type == 'bpmn:SequenceFlow';

        if (isConnection) {

            const sourceItem = this.items.find(t => t.id == event.context.element.businessObject.sourceRef.$attrs.taskId);
            const nextId = event.context.element.businessObject.targetRef.$attrs.taskId;
            const nextItem = this.getItemNextItems(sourceItem).find(entry => entry.id == nextId);

            if (nextItem) {
                nextItem.name = event.context.newLabel;
            }

        } else {
            const item = this.items.find(t => t.id == event.context.element.businessObject.$attrs.taskId);
            item.name = event.context.newLabel;

            // emit the name change only for the item. Connection name change emit is not supported
            this.latestItemChange.set({
                id: item.id,
                type: item.type,
                name: item.name
            });
        }
    }

    /**
     * set temporary the source item id and connect the items
     * @param sequenceFlow
     * @private
     */
    private handleChangeDiagramConnection(sequenceFlow: BpmnElementI) {

        if (sequenceFlow.target.type == 'bpmn:TextAnnotation') return;

        this.connectItems(
            sequenceFlow.source.businessObject.$attrs.taskId,
            this.items.find(t => t.id == sequenceFlow.target.businessObject.$attrs.taskId)
        );
    }

    /**
     * delete an item connection to a next item
     * @param item
     * @param nextItemId
     * @private
     */
    private deleteItemNextItem(item: DiagramItemI, nextItemId: string) {
        item.nextItems = item.nextItems.filter(entry => entry.id != nextItemId);
        this.latestLinkChange.set({
            fromId: item.id,
            nextId: nextItemId,
            action: 'delete'
        });
    }

    /**
     * remove the connection in tasks
     * @param sequenceFlow
     * @private
     */
    private handleDeleteDiagramConnection(sequenceFlow: BpmnElementI) {

        const sourceAttrs = sequenceFlow.source.businessObject.$attrs;
        const targetAttrs = sequenceFlow.target.businessObject.$attrs;

        const sourceItem = this.items.find(t => t.id == (sourceAttrs.taskId ?? sourceAttrs.replacedShapeRefId));
        const targetItem = this.items.find(t => t.id == (targetAttrs.taskId ?? targetAttrs.replacedShapeRefId));

        if (!sourceItem || !targetItem) return;

        this.deleteItemNextItem(sourceItem, targetItem.id);
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
     * assign next item from diagram
     * @private
     * @param sourceId
     * @param targetItem
     */
    private connectItems(sourceId: string, targetItem: any) {

        this.items.some(item => {
            if (sourceId == item.id) {

                if (this.getItemNextItems(item).some(t => t.id == targetItem.id)) {
                    return;
                }
                this.appendItemNextItem(item, targetItem);

                return true;
            }
        });
    }

    /**
     * get item next items
     * @param item
     * @param nextItem
     */
    public appendItemNextItem(item: DiagramItemI, nextItem: DiagramNextItemI) {

        if (!Array.isArray(item.nextItems)) {
            item.nextItems = [];
        }

        const nextItemObject: DiagramNextItemI = {id: nextItem.id, name: nextItem.name};

        item.nextItems.push(nextItemObject);

        this.latestLinkChange.set({
            fromId: item.id,
            nextId: nextItem.id,
            action: 'change'
        });
    }

    /**
     * connect diagram elements
     * @param sourceId
     * @param targetId
     */
    public connectDiagramElements(sourceId: string, targetId: string) {

        const elements = this.bpmnJS.get('elementRegistry');
        const source = elements.find(e => e.businessObject.$attrs.taskId == sourceId);
        const target = elements.find(e => e.businessObject.$attrs.taskId == targetId);

        const modeling = this.bpmnJS.get('modeling');

        modeling.connect(source, target);
    }

    /**
     * create a diagram item and append it
     * @param item
     * @param parentId
     */
    public createAndAppendDiagramElement(item: {name: string, id: string, tasktype: string}, parentId?: string) {

        this.currentAddingItem = item;
        const element = this.createDiagramElement(item.tasktype);

        // item is appended to the parent element
        if (parentId) {
            const source = this.bpmnJS.get('elementRegistry').find(e => e.businessObject.$attrs.taskId == parentId);
            const autoPlace = this.bpmnJS.get('autoPlace');
            autoPlace.append(source, element);
        } else { // first element is appended to the process

            const elementRegistry = this.bpmnJS.get('elementRegistry');
            const modeling = this.bpmnJS.get('modeling');

            const process = elementRegistry.get('Process_1');

            const tap = 150;

            modeling.createElements(element, {x: tap, y: tap}, process);
        }

        this.currentAddingItem = undefined;
    }

    /**
     * create diagram element from task
     * @private
     */
    private createDiagramElement(tasktype?: string): BpmnElementI {

        const elementFactory = this.bpmnJS.get('elementFactory');

        const type = {
            bpmnType: tasktype ? `bpmn:${tasktype}` : 'bpmn:Task',
            eventDefinitionType: undefined
        };

        return elementFactory.createShape({
            type: type.bpmnType,
            eventDefinitionType: type.eventDefinitionType
        });
    }

}

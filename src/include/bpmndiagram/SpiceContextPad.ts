/**
 * BPMN custom context pad class to provide custom element actions
 */
import {WorkflowTaskTypeI} from "../../modules/workflow/interfaces/workflow.interfaces";

export const diagramElementTypes: {taskType: string, bpmnType: string, eventDefinitionType?: string}[] = [
    {taskType: 'regular' , bpmnType: 'bpmn:IntermediateThrowEvent'},
    {taskType: 'end' , bpmnType: 'bpmn:EndEvent'},
    {taskType: 'start' , bpmnType: 'bpmn:StartEvent'},
    {taskType: 'gateway_decision' , bpmnType: 'bpmn:ExclusiveGateway'},
    {taskType: 'gateway_email_event' , bpmnType: 'bpmn:EventBasedGateway'},
    {taskType: 'email_event_open' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:MessageEventDefinition'},
    {taskType: 'email_event_bounce' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:SignalEventDefinition'},
    {taskType: 'email_event_timer' , bpmnType: 'bpmn:IntermediateCatchEvent', eventDefinitionType: 'bpmn:TimerEventDefinition'},
];

/**
 * context pad provider class to customize the actions on shape popover
 */
export class SpiceContextPad {

    /**
     * bpmn-js services to be injected by bpmn-js script
     */
    $inject = [ 'config', 'contextPad', 'create', 'elementFactory', 'injector', 'translate', 'eventBus' ];
    /**
     * bpmn-js services variables
     */
    create; elementFactory; translate; autoPlace; eventBus;
    /**
     * static array of the task types filled from the workflow diagram service
     */
    static taskTypes: WorkflowTaskTypeI[];

    constructor(config, contextPad, create, elementFactory, injector, translate, eventBus) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.eventBus = eventBus;
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }
        contextPad.registerProvider(this);
    }

    /**
     * override default method to customize the actions
     * @param element
     */
    public getContextPadEntries(element): (entries) => any {

        const { autoPlace, create, elementFactory, translate, eventBus } = this;

        /**
         * the default entries
         * 0: 'append.end-event'
         * 1: 'append.gateway'
         * 2: 'append.append-task'
         * 3: 'append.intermediate-event'
         * 4: 'replace'
         * 5: 'append.text-annotation'
         * 6: 'connect'
         * 7: 'delete'
         */
        return (entries) => {

            // define default actions
            const customEntries = {
                'connect': entries.connect,
                'delete': entries.delete,
                'edit.task': {
                    group: 'model',
                    className: 'bpmn-icon-screw-wrench',
                    title: 'edit',
                    action: {
                        click: (event, element) => eventBus.fire('edit.task', element)
                    }
                }
            };

            let types = SpiceContextPad.taskTypes;

            if (element.type == 'bpmn:EndEvent') {
                return {'edit.task': customEntries['edit.task'], 'delete': customEntries.delete};
            }

            if (element.type == 'bpmn:EventBasedGateway') {
                types = types.filter(t => t.type.startsWith('email_event'));
            } else {
                types = types.filter(t => !t.type.startsWith('email_event'));
            }

            // define custom actions from task types
            types.forEach(type => {

                if (type.type == 'start') return;
                const bpmnTypeMap = diagramElementTypes.find(e => e.taskType == type.type);
                const createShape = () => elementFactory.createShape({ type: bpmnTypeMap.bpmnType, eventDefinitionType: bpmnTypeMap.eventDefinitionType} );

                const createTaskType = event => {
                    if (autoPlace) {
                        const newShape = createShape();
                        eventBus.fire(type.id, newShape);
                        autoPlace.append(element, newShape);
                    } else {
                        appendTaskTypeStart(event);
                    }
                };

                const appendTaskTypeStart = event => {
                    const newShape = createShape();
                    eventBus.fire(type.id, newShape);
                    create.start(event, newShape, {source: element});

                };

                customEntries[type.id] = {
                    group: 'model',
                    className: `bpmn-icon-${(type.icon ?? 'intermediate-event-none')}`,
                    title: `add ${type.name} task`,
                    action: {
                        click: createTaskType,
                        dragstart: appendTaskTypeStart
                    }
                };
            });

            return customEntries;
        };
    }
}

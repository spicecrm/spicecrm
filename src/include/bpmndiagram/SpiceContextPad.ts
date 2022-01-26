/**
 * BPMN custom context pad class to provide custom element actions
 */
import {WorkflowTaskTypeI} from "../../modules/workflow/interfaces/workflow.interfaces";

export const diagramElementTypes: {taskType: string, bpmnType: string}[] = [
    {taskType: 'regular' , bpmnType: 'bpmn:IntermediateThrowEvent'},
    {taskType: 'end' , bpmnType: 'bpmn:EndEvent'},
    {taskType: 'start' , bpmnType: 'bpmn:StartEvent'},
    {taskType: 'gateway_decision' , bpmnType: 'bpmn:ExclusiveGateway'},
    {taskType: 'gateway_event_based' , bpmnType: 'bpmn:EventBasedGateway'}
];

export class SpiceContextPad {

    $inject = [
        'config',
        'contextPad',
        'create',
        'elementFactory',
        'injector',
        'translate',
        'eventBus'
    ];
    create; elementFactory; translate; autoPlace; eventBus;
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

    getContextPadEntries(element) {
        const { autoPlace, create, elementFactory, translate, eventBus } = this;

        /**
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

            // define custom actions from task types
            SpiceContextPad.taskTypes.forEach(type => {

                const createShape = () => elementFactory.createShape({ type: diagramElementTypes.find(e => e.taskType == type.type).bpmnType });

                const createTaskType = event => {
                    if (autoPlace) {
                        autoPlace.append(element, createShape());
                        eventBus.fire(type.id, element);
                    } else {
                        appendTaskTypeStart(event);
                    }
                };

                const appendTaskTypeStart = event => {
                    const shape = elementFactory.createShape({ type: diagramElementTypes.find(e => e.taskType == type.type).bpmnType });
                    create.start(event, shape, {source: element});
                    eventBus.fire(type.id, element);

                };

                customEntries[type.id] = {
                    group: 'model',
                    className: `bpmn-icon-${(type.icon ?? 'intermediate-event-none')}`,
                    title: `add ${type.name}`,
                    action: {
                        click: createTaskType,
                        dragstart: appendTaskTypeStart
                    }
                };
            });

            if (!entries['append.intermediate-event']) {
                return entries;
            }

            return customEntries;
        };
    }
}

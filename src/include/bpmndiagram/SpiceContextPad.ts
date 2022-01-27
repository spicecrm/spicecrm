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

            // define custom actions from task types
            SpiceContextPad.taskTypes.forEach(type => {

                const createShape = () => elementFactory.createShape({ type: diagramElementTypes.find(e => e.taskType == type.type).bpmnType });

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

            if (!entries['append.intermediate-event']) {
                return entries;
            }

            return customEntries;
        };
    }
}

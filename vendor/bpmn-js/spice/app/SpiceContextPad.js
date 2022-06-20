/**
 * context pad provider class to customize the actions on shape popover
 */
export default class SpiceContextPad {

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
    static taskTypes = [];
    static elementTypes = [];

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
    getContextPadEntries(element) {

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

            if (!SpiceContextPad.elementTypes.some(t => t.bpmnType === element.type)) return entries;

            // define default actions
            const customEntries = {
                'edit.task': {
                    group: 'model',
                    className: 'bpmn-icon-screw-wrench',
                    title: 'edit',
                    action: {
                        click: (event, element) => eventBus.fire('edit.task', element)
                    }
                },
                'append.text-annotation': entries['append.text-annotation'],
                'connect': entries['connect'],
            };

            let types = SpiceContextPad.taskTypes;

            if (element.type !== 'bpmn:StartEvent') {
                customEntries.delete = entries.delete;
            }

            if (element.type === 'bpmn:EndEvent') {
                return {
                    'edit.task': customEntries['edit.task'],
                    'delete': customEntries.delete,
                    'append.text-annotation': entries['append.text-annotation'],
                    'connect': entries['connect'],
                };
            }

            // filter the types between email task and all others
            if (element.businessObject.$attrs.taskType !== 'gateway_email_event') {
                types = types.filter(t => !t.type.startsWith('email_event'));
            }

            // define custom actions from task types
            types.forEach(type => {

                if (type.type === 'start') return;

                const bpmnTypeMap = SpiceContextPad.elementTypes.find(e => e.taskType === type.type);
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

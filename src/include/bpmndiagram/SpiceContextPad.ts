/**
 * BPMN custom context pad class to provide custom element actions
 */
import {WorkflowTaskTypeI} from "../../modules/workflow/interfaces/workflow.interfaces";

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

            console.log(SpiceContextPad.taskTypes);

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
            SpiceContextPad.taskTypes.forEach(t => {
                customEntries[t.id] = {
                    group: 'model',
                    className: `bpmn-icon-${(t.icon ?? 'intermediate-event-none')}`,
                    title: `add ${t.name}`,
                    action: {
                        click: (event, element) => eventBus.fire(t.id, element)
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

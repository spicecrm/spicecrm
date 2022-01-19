/**
 * BPMN custom context pad class to provide custom element actions
 */
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

            if (!entries['append.intermediate-event']) {
                return entries;
            }

            return {
                'append.intermediate-event': entries['append.intermediate-event'],
                'append.end-event': entries['append.end-event'],
                'append.gateway': entries['append.gateway'],
                'connect': entries.connect,
                'delete': entries.delete,
                'append.service-task': {
                    group: 'model',
                    className: 'bpmn-icon-screw-wrench',
                    title: translate('Append ServiceTask'),
                    action: {
                        click: (event, element) => eventBus.fire('edit.task', element)
                    }
                }
            };

        };
    }
}

/**
 * BPMN custom palette class to provide custom element actions
 */
 export default class SpicePalette {

    $inject = [ 'create', 'elementFactory', 'palette', 'translate', 'eventBus', 'zoomScroll' ];
    create; translate; elementFactory; eventBus; zoomScroll;

    constructor(create, elementFactory, palette, translate, eventBus, zoomScroll) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.eventBus = eventBus;
        this.zoomScroll = zoomScroll;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {

        const {zoomScroll, eventBus} = this;

        /*
      0: 'hand-tool'
      1: 'lasso-tool'
      2: 'space-tool'
      3: 'global-connect-tool'
      4: 'tool-separator'
      5: 'create.start-event'
      6: 'create.intermediate-event'
      7: 'create.end-event'
      8: 'create.exclusive-gateway'
      9: 'create.task'
      10: 'create.data-object'
      11: 'create.data-store'
      12: 'create.subprocess-expanded'
      13: 'create.participant-expanded'
      14: 'create.group'
      */

        const types = SpicePalette.taskTypes ?? [];

        if (types.length === 0) {
            return entries => entries;
        }

        const customEntries = {};

        types.forEach(type => {

            const bpmnType = SpicePalette.elementTypes.find(e => e.taskType === type.type);

            const createTaskType = event => {
                var shape = this.elementFactory.createShape({ type: bpmnType.bpmnType });
                this.create.start(event, shape);
                this.eventBus.fire(type.id, shape);
            };

            customEntries[type.id] = {
                group: 'model',
                className: `bpmn-icon-${(type.icon ?? 'intermediate-event-none')}`,
                title: `add ${type.name} task`,
                action: {
                    click: createTaskType,
                    dragstart: createTaskType
                }
            };
        });

        return entries => {
            return {
                'hand-tool': entries['hand-tool'],
                'zoom-reset': {
                    group: 'zoom',
                    className: 'bpmn-icon-target',
                    title: 'reset zoom',
                    action: {
                        click: () => zoomScroll.reset()
                    }
                },
                'zoom-in': {
                    group: 'zoom',
                    className: 'bpmn-icon-plus',
                    title: 'zoom in',
                    action: {
                        click: () => zoomScroll.stepZoom(1)
                    }
                },
                'zoom-out': {
                    group: 'zoom',
                    className: 'bpmn-icon-minus',
                    title: 'zoom out',
                    action: {
                        click: () => zoomScroll.stepZoom(-1)
                    }
                },
                'create.group': entries['create.group']
            , ...customEntries}
        }
    }
}

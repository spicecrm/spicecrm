/**
 * BPMN custom palette class to provide custom element actions
 */
export class SpicePalette {
    $inject = [ 'create', 'elementFactory', 'palette', 'translate', 'eventBus' ];
    create; translate; elementFactory; eventBus;

    constructor(create, elementFactory, palette, translate, eventBus) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.eventBus = eventBus;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
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

        return entries => {
            return {
                'hand-tool': entries['hand-tool']
            }
        }
    }
}

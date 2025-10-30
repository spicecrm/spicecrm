/**
 * context pad provider class to customize the actions on shape popover
 */
export default class SpiceContextPad {

    /**
     * bpmn-js services to be injected by bpmn-js script
     */
    $inject = [ 'config', 'contextPad', 'create', 'elementFactory', 'injector', 'translate', 'eventBus', 'overlays'];
    /**
     * bpmn-js services variables
     */
    create; elementFactory; translate; autoPlace; eventBus; overlays; contextPad; modeling;
    /**
     * static array of the task types filled from the workflow diagram service
     */
    static taskTypes = [];
    static elementTypes = [];

    constructor(config, contextPad, create, elementFactory, injector, translate, eventBus, overlays, modeling) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.eventBus = eventBus;
        this.overlays = overlays;
        this.contextPad = contextPad;
        this.modeling = modeling;
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }
        contextPad.registerProvider(this);
    }

    generateFillColor(hex) {
        const percent = 80;
        hex = hex.replace(/^#/, '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
        const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
        const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }


    /**
     * open the color picker input and set the selected element color
     * @param event
     * @param element
     */
    openColorPicker(event, element) {

        event.stopPropagation();
        event.preventDefault();

        const input = document.createElement('input');

        const overlayId = `color-picker-${element.id}`;

        const closeOverlay = () => {
            try {
                this.overlays.remove(overlayId);
            } catch (e) {
                // ignore if already removed
            }
            // Remove the "click-away" listener
            window.removeEventListener('click', closeOverlay);
        };


        // --- Create the HTML for the overlay ---
        const html = document.createElement('div');
        input.type = 'color';
        input.style.opacity = '0';

        // Get the current color to set default
        const businessObject = element.businessObject;
        input.value = businessObject.di.get('stroke') || '#000000';

        html.appendChild(input);

        // Listen for the color change
        input.addEventListener('change', (e) => {

            e.stopPropagation();

            const strokeColor = e.target.value;
            const fillColor = this.generateFillColor(strokeColor);

            const colors = {
                stroke: strokeColor,
                fill: fillColor
            };

            // Groups/Annotations don't have a fill
            if (['bpmn:TextAnnotation', 'bpmn:Group'].includes(element.type)) {
                delete colors.fill;
            }

            // Apply the color
            this.modeling.setColor(element, colors);

            this.eventBus.fire('shape.color.changed');

            closeOverlay();
        });

        // Automatically click the input to open the picker

        // Add the overlay to the element
        this.overlays.add(element, overlayId, {
            position: {bottom: 0, right: 0},
            html: html
        });

        setTimeout(() => {
            input.click();
            window.addEventListener('click', closeOverlay);
        });
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

            const editTaskAction = {
                group: 'edit',
                className: 'bpmn-icon-pen',
                title: 'edit',
                action: {
                    click: (event, element) => eventBus.fire('edit.task', element)
                }
            };

            const changeColorAction = {
                group: 'edit',
                className: 'bpmn-icon-color-picker',
                title: 'Change Color',
                html: `<div class="entry" data-action="change-color" title="Change Color"><svg style="margin-top: -10px" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" /></svg></div>`,
                action: {
                    click: (event, element) => this.openColorPicker(event, element)
                }
            };

            // if no custom tasks return the default context menu plus an edit button
            if (!SpiceContextPad.taskTypes?.length || !SpiceContextPad.elementTypes.some(t => t.bpmnType === element.type)) {

                //exclude elements that are not items
                if (!['bpmn:SequenceFlow', 'bpmn:Participant', 'label', 'bpmn:Group', 'bpmn:Lane', 'bpmn:TextAnnotation', 'bpmn:SubProcess'].includes(element.type)) {
                    entries['edit.task'] = editTaskAction;
                }

                if (!['bpmn:Lane', 'label'].includes(element.type)) {
                    entries['change-color'] = changeColorAction;
                }

                return entries;
            }

            // define default actions
            const customEntries = {
                'edit.task': editTaskAction,
                'change-color': changeColorAction,
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

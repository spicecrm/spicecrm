import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    remove as svgRemove
} from 'tiny-svg';

import {is} from 'bpmn-js/lib/util/ModelUtil';
import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
    isTypedEvent,
    isThrowEvent,
    isCollection,
    getDi,
    getSemantic,
    getCirclePath,
    getRoundRectPath,
    getDiamondPath,
    getRectPath,
    getFillColor,
    getStrokeColor,
    getLabelColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    isObject,
    assign,
    forEach
} from 'min-dash';

const HIGH_PRIORITY = 1500,
    TASK_BORDER_RADIUS = 2;

export default class SpiceRenderer extends BaseRenderer {

    constructor(eventBus, bpmnRenderer, config, styles, pathMap) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        if ( config && config.defaultStrokeColor) {
            this.defaultStrokeColor = config.defaultStrokeColor;
            this.defaultFillColor = config.defaultFillColor;
        }

        this.computeStyle = styles.computeStyle;
        this.pathMap = pathMap;
    }

    /**
     * necessary to enable draw shape
     * @param element
     * @returns {boolean}
     */
    canRender(element) {
        return is(element, 'bpmn:BaseElement');
    }

    /**
     * customized draw shape
     * @param parentNode
     * @param element
     * @returns {*}
     */
    drawShape(parentNode, element) {

        if (element.type == 'label') {
            return this.bpmnRenderer.drawShape(parentNode, element);
        }

        const icon = element.businessObject.$attrs.icon;

        const eType = element.type;
        /**
         * sms task
         */
        if (icon == 'end-event-message') {
            return this.drawStartEvent(parentNode, element, 'bpmn:MessageEventDefinition', true);
        }
        /**
         * email task
         */
        if (icon == 'start-event-message') {
            return this.drawStartEvent(parentNode, element, 'bpmn:MessageEventDefinition');
        }
        /**
         * system task
         */
        if (icon == 'start-event-condition') {
            return this.drawStartEvent(parentNode, element, 'bpmn:ConditionalEventDefinition');
        }

        // email opt out task
        if (icon == 'end-event-error') {
            return this.drawStartEvent(parentNode, element, 'bpmn:ErrorEventDefinition', true);
        }

        // email event handle task
        if (icon == 'end-event-signal') {
            return this.drawStartEvent(parentNode, element, 'bpmn:SignalEventDefinition', true);
        }

        const shape = this.bpmnRenderer.drawShape(parentNode, element);

        return shape;
    }

    /**
     * customized get shape path
     * @param shape
     * @returns {*}
     */
    getShapePath(shape) {

        const icon = shape.businessObject.$attrs.icon;

        const sType = shape.type;

        if (icon == 'start-event-message') {
            shape.type = 'bpmn:EventBasedGateway';
        }

        const path = this.bpmnRenderer.getShapePath(shape);

        shape.type = sType;

        return path;
    }

    /**
     * customized draw start event
     * @see bpmnRenderer.handlers['bpmn:StartEvent']
     * @param parentGfx
     * @param element
     * @returns {*}
     */
    drawStartEvent(parentGfx, element, innerType, fill = false) {

        var attrs = {
            fill: getFillColor(element, this.defaultFillColor),
            stroke: getStrokeColor(element, this.defaultStrokeColor)
        };

        var circle = this.bpmnRenderer.handlers['bpmn:Event'](parentGfx, element, attrs);

        this.renderEventContent(element, parentGfx, innerType, fill);

        return circle;
    }

    renderEventContent(element, parentGfx, innerType, fill = false) {

        if (innerType == 'bpmn:MessageEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:MessageEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:TimerEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:TimerEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:ConditionalEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:ConditionalEventDefinition'](parentGfx, element);
        }

        if (innerType == 'bpmn:SignalEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:SignalEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:EscalationEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:EscalationEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:LinkEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:LinkEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:ErrorEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:ErrorEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:CancelEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:CancelEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:CompensateEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:CompensateEventDefinition'](parentGfx, element, fill);
        }

        if (innerType == 'bpmn:TerminateEventDefinition') {
            return this.bpmnRenderer.handlers['bpmn:TerminateEventDefinition'](parentGfx, element, fill);
        }

        return null;
    }

    drawEvent(element, parentGfx) {

        var pathData = this.pathMap.getScaledPath('GATEWAY_EVENT_BASED', {
            xScaleFactor: 0.18,
            yScaleFactor: 0.18,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
                mx: 0.36,
                my: 0.44
            }
        });

        var attrs = {
            strokeWidth: 2,
            fill: getFillColor(element, 'none'),
            stroke: getStrokeColor(element, this.defaultStrokeColor)
        };

        /* event path */ this.drawPath(parentGfx, pathData, attrs);
    }


    drawCircle(parentGfx, width, height, offset, attrs) {

        if (isObject(offset)) {
            attrs = offset;
            offset = 0;
        }

        offset = offset || 0;

        attrs = this.computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        if (attrs.fill === 'none') {
            delete attrs.fillOpacity;
        }

        var cx = width / 2,
            cy = height / 2;

        var circle = svgCreate('circle');
        svgAttr(circle, {
            cx: cx,
            cy: cy,
            r: Math.round((width + height) / 4 - offset)
        });
        svgAttr(circle, attrs);

        svgAppend(parentGfx, circle);

        return circle;
    }

    drawPath(parentGfx, d, attrs) {

        attrs = this.computeStyle(attrs, [ 'no-fill' ], {
            strokeWidth: 2,
            stroke: 'black'
        });

        var path = svgCreate('path');
        svgAttr(path, { d: d });
        svgAttr(path, attrs);

        svgAppend(parentGfx, path);

        return path;
    }
}

SpiceRenderer.$inject = ['eventBus', 'bpmnRenderer', 'config.bpmnRenderer', 'styles', 'pathMap'];

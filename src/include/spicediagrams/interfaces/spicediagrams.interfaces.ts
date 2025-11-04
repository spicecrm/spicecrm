import {SpiceBeanI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";

export interface BpmnInstanceI {
    get(service: string),
    saveXML(): Promise<{xml: string}>,
    importXML(xml: string),
    destroy(),
    createDiagram(),
    attachTo(el: any),
    detach(),
    clear(),
    saveSVG(): Promise<{svg: string}>,
}

export interface DiagramItemI {
    id: string;
    type: string;
    name: string;
    nextItems: DiagramNextItemI[];
    data: SpiceBeanI
}

export interface DiagramNextItemI {
    id: string;
    name?: string;
}

export interface DiagramOptionsI {
    /**
     * if true show the icon-buttons for each available type in the palette panel
     */
    hideCreateItemButtonsInPalette: boolean;
}

export interface DiagramLinkChangeI {
    fromId: string;
    nextId: string;
    action: 'change' | 'delete';
}

export interface DiagramItemChangeI {
    id: string;
    type: string;
    name: string;
}

/**
 * bpmn-js diagram element structure
 */
export interface BpmnElementI {
    id: string,
    type: 'bpmn:IntermediateThrowEvent' | 'bpmn:EndEvent' | 'bpmn:StartEvent' | 'bpmn:ExclusiveGateway' | 'bpmn:EventBasedGateway' | 'bpmn:TextAnnotation' | 'label';
    source: BpmnElementI,
    target: BpmnElementI,
    x: number,
    y: number,
    businessObject: {
        eventDefinitions: { $type: string }[]
        $type?: string;
        incoming?: any[];
        $attrs: {
            taskId: string,
            replacedShapeRefId?: string
        }
        sourceRef: { $attrs: { taskId: string } }
        targetRef: { $attrs: { taskId: string } }
    };
}

/**
 * bpmn-js diagram event structure
 */
export interface BpmnEventI {
    element?: BpmnElementI;
    delegateTarget?: HTMLElement;
    type: string;
    context: {
        element: BpmnElementI,
        newLabel: string,
        shape: BpmnElementI,
        newData: { eventDefinitionType: string, type: string, businessObject: { $attrs: { taskId: string } } },
        oldShape: BpmnElementI,
        newShape: BpmnElementI,
    }

}

export interface BpmnSVGAttributesI {
    viewBox: string;
    width: string;
    height: string;
}
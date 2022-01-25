/**
 * object of WorkflowTaskType vardefs
 */
export interface WorkflowTaskTypeI {
    id: string;
    name: string;
    frontend_component: string;
    admin_component: string;
    handler_class: string;
    /**
     * icons class to use for the context pad
     * https://cdn.staticaly.com/gh/bpmn-io/bpmn-font/master/dist/demo.html
     * use the .bpmn-icon class without (bpmn-icon-) e.g. for (bpmn-icon-task) use (task)
     */
    icon: string;
    type: 'regular' | 'gateway_event_based' | 'gateway_decision' | 'start' | 'end';
    deleted: boolean;
}


/**
 * object of WorkflowTaskDefinition vardefs
 */
export interface WorkflowTaskDefinitionI {
    id: string;
    name: string;
    workflowdefinition_id: string;
    tasktype: string;
    type_config: {
        decisions?: {id: string, name: string }[],
        next_tasks?: string[]
    }
    systemactions: [];
    sequence: number;
    primarytask: boolean;
    closetask: boolean;
    deleted: boolean | 1 | 0;
}

/**
 * bpmn-js diagram element structure
 */
export interface BpmnDiagramElementI {
    type: 'bpmn:IntermediateThrowEvent' | 'bpmn:EndEvent' | 'bpmn:StartEvent' | 'bpmn:ExclusiveGateway' | 'bpmn:EventBasedGateway' | 'label';
    source: BpmnDiagramElementI,
    target: BpmnDiagramElementI,
    businessObject: {
        $attrs: {
            taskId: string
        }
        sourceRef: { $attrs: { taskId: string }}
        targetRef: { $attrs: { taskId: string }}
    };
}

/**
 * bpmn-js diagram event structure
 */
export interface BpmnDiagramEventI {
    element: BpmnDiagramElementI,
    context: {
        element: BpmnDiagramElementI,
        newLabel: string
    }

}

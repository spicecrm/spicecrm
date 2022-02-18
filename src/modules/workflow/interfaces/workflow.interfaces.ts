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
    type: 'regular' | 'gateway_email_event' | 'gateway_decision' | 'start' | 'end' | 'email_event_open' | 'email_event_bounce' | 'email_event_timer';
    deleted: boolean;
}

/**
 * next task array item
 */
export interface NextTaskI {
    id: string;
    name: string;
    type: string;

}

/**
 * object of WorkflowTaskDefinition vardefs
 */
export interface WorkflowTaskDefI {
    id: string;
    name: string;
    workflowdefinition_id: string;
    tasktype: string;
    type_config: {
        next_tasks?: NextTaskI[],
        /**
         * could be any generic configuration for the task type
         */
        [key: string]: any
    }
    sequence: number;
    ishidden?: boolean;
    allowcomment?: boolean;
    prevclosedreq?: boolean;
    assigntouser?: string;
    assignparent?: string;
    assignclass?: string;
    assignparams?: string;
    timetostart?: string;
    timetocomplete?: string;
    timetoalert?: string;
    timetoescalate?: string;
    deleted: boolean | 1 | 0;
    /**
     * check language dom workflowdefinition_assgintotypes
     * '1' => 'User',
     * '2' => 'Workgroup',
     * '3' => 'User assigned to Parent Object',
     * '4' => 'Manager of User assigned to Parent Object',
     * '5' => 'system routine',
     * '6' => 'Creator'
     */
    assigntype?:  '1' | '2' | '3' | '4' | '5' | '6';
}

/**
 * bpmn-js diagram element structure
 */
export interface BpmnElementI {
    type: 'bpmn:IntermediateThrowEvent' | 'bpmn:EndEvent' | 'bpmn:StartEvent' | 'bpmn:ExclusiveGateway' | 'bpmn:EventBasedGateway' | 'label';
    source: BpmnElementI,
    target: BpmnElementI,
    businessObject: {
        incoming?: any[];
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
export interface BpmnEventI {
    element?: BpmnElementI;
    type: string;
    context: {
        element: BpmnElementI,
        newLabel: string
    }

}

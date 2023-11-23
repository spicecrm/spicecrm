/**
 * @module ModuleWorkflow
 */
import {CommonModule,} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {ObjectFields} from '../../objectfields/objectfields';
import {DirectivesModule} from '../../directives/directives';
import {DragDropModule} from "@angular/cdk/drag-drop";

import * as interfaces from "./interfaces/workflow.interfaces";
import {workflow} from "./services/workflow.service";
import {WorkflowManagerService} from "./services/workflowmanager.service";

import {WorkflowMyOpenTasksPipe} from "./pipes/workflowmyopentaskspipe";
import {WorkflowOpenWorkflowsPipe} from "./pipes/workflowopenworkflowspipe";
import {WorkflowCompletedWorkflowsPipe} from "./pipes/workflowcompletedworkflowspipe";

import {WorkflowManagerTaskTypesStandard} from "./components/workflowmanagertasktypesstandard";
import {WorkflowManagerTaskTypesEmail} from "./components/workflowmanagertasktypesemail";
import {WorkflowManagerTaskTypesSystem} from "./components/workflowmanagertasktypessystem";
import {WorkflowManagerTaskTypesDecision} from "./components/workflowmanagertasktypesdecision";
import {WorkflowManagerTaskTypesSms} from "./components/workflowmanagertasktypessms";
import {WorkflowManagerTaskNextTasks} from "./components/workflowmanagertasknexttasks";
import {WorkflowManager} from "./components/workflowmanager";
import {WorkflowManagerTaskTypesModal} from "./components/workflowmanagertasktypesmodal";
import {WorkflowManagerDetailTasks} from "./components/workflowmanagerdetailtasks";
import {WorkflowManagerDetailTasksLine} from "./components/workflowmanagerdetailtasksline";
import {WorkflowManagerDetailTask} from "./components/workflowmanagerdetailtask";
import {WorkflowManagerDetailTaskTaskpanel} from "./components/workflowmanagerdetailtasktaskpanel";
import {WorkflowManagerDetailTaskAssignmentpanel} from "./components/workflowmanagerdetailtaskassignmentpanel";
import {WorkflowManagerDetailTaskSystemactionsLine} from "./components/workflowmanagerdetailtasksystemactionsline";
import {WorkflowPanel} from "./components/workflowpanel";

import {WorkflowPanelHeader} from "./components/workflowpanelheader";
import {WorkflowPanelItem} from "./components/workflowpanelitem";
import {WorkflowPanelTasks} from "./components/workflowpaneltasks";
import {WorkflowPanelTasksItem} from "./components/workflowpaneltasksitem";
import {WorkflowPanelTask} from "./components/workflowpaneltask";
import {WorkflowPanelTasksComments} from "./components/workflowpaneltaskscomments";
import {WorkflowTasksDashlet} from "./components/workflowtasksdashlet";
import {fieldWorkflowTaskName} from "./fields/fieldworkflowtaskname";
import {WorkflowPanelTaskStandard} from "./components/workflowpaneltaskstandard";
import {WorkflowPanelTaskDecision} from "./components/workflowpaneltaskdecision";

import {WorkflowCloseWorkflowButton} from "./components/workflowcloseworkflowbutton";
import {WorkflowManagerFieldsdropdown} from "./components/workflowmanagerfieldsdropdown";
import {WorkflowManagerTaskEditModal} from "./components/workflowmanagertaskteditmodal";
import {WorkflowManagerEditModal} from "./components/workflowmanagereditmodal";
import {WorkflowManagerTaskTypesStart} from "./components/workflowmanagertasktypesstart";
import {WorkflowManagerTaskTypesEnd} from "./components/workflowmanagertasktypesend";
import {WorkflowTimelineItem} from "./components/workflowtimelineitem";
import {WorkflowTaskStatusIcon} from "./components/workflowtaskstatusicon";
import {WorkflowManagerTaskTypesEmailHandle} from "./components/workflowmanagertasktypesemailhandle";
import {WorkflowManagerTaskTypesCloseWorkflows} from "./components/workflowmanagertasktypescloseworkflows";
import {WorkflowManagerTaskTypesGenerateBean} from "./components/workflowmanagertasktypesgeneratebean";
import {WorkflowMonitor} from "./components/workflowmonitor";
import {WorkflowChart} from "./components/workflowchart";
import {WorkflowManagerTaskTypesConditionalDecision} from "./components/workflowmanagertasktypesconditionaldecision";
import {
    WorkflowManagerConditionalDecisionTaskConditionsModal
} from "./components/workflowmanagerconditionaldecisiontaskconditionsmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        ObjectFields,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        WorkflowManagerFieldsdropdown,
        WorkflowManager,
        WorkflowManagerTaskTypesModal,
        WorkflowManagerDetailTasks,
        WorkflowManagerDetailTasksLine,
        WorkflowManagerDetailTask,
        WorkflowManagerDetailTaskTaskpanel,
        WorkflowManagerDetailTaskAssignmentpanel,
        WorkflowManagerDetailTaskSystemactionsLine,
        WorkflowPanel,
        WorkflowOpenWorkflowsPipe,
        WorkflowCompletedWorkflowsPipe,
        WorkflowMyOpenTasksPipe,
        WorkflowPanelHeader,
        WorkflowPanelItem,
        WorkflowPanelTasks,
        WorkflowPanelTasksItem,
        WorkflowPanelTasksComments,
        WorkflowPanelTask,
        WorkflowTasksDashlet,
        WorkflowCloseWorkflowButton,
        fieldWorkflowTaskName,
        WorkflowManagerTaskTypesGenerateBean,
        WorkflowManagerTaskTypesEmail,
        WorkflowManagerTaskTypesSystem,
        WorkflowManagerTaskTypesDecision,
        WorkflowManagerTaskTypesSms,
        WorkflowManagerTaskTypesStandard,
        WorkflowManagerTaskNextTasks,
        WorkflowPanelTaskStandard,
        WorkflowPanelTaskDecision,
        WorkflowManagerTaskEditModal,
        WorkflowManagerEditModal,
        WorkflowManagerTaskTypesStart,
        WorkflowManagerTaskTypesEnd,
        WorkflowTimelineItem,
        WorkflowTaskStatusIcon,
        WorkflowManagerTaskTypesEmailHandle,
        WorkflowManagerTaskTypesCloseWorkflows,
        WorkflowMonitor,
        WorkflowChart,
        WorkflowManagerTaskTypesConditionalDecision,
        WorkflowManagerConditionalDecisionTaskConditionsModal
    ]
})
export class ModuleWorkflow {
}

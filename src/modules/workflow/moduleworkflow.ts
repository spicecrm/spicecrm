/**
 * @module ModuleWorkflow
 */
import {CommonModule,} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import { SystemComponents}      from '../../systemcomponents/systemcomponents';
import { ObjectComponents}      from '../../objectcomponents/objectcomponents';
import { ObjectFields}      from '../../objectfields/objectfields';
import { DirectivesModule}      from '../../directives/directives';

import /*embed*/ {workflow} from "./services/workflow.service";

import /*embed*/ {WorkflowMyOpenTasksPipe} from "./pipes/workflowmyopentaskspipe";
import /*embed*/ {WorkflowOpenWorkflowsPipe} from "./pipes/workflowopenworkflowspipe";
import /*embed*/ {WorkflowCompletedWorkflowsPipe} from "./pipes/workflowcompletedworkflowspipe";
import /*embed*/ {WorkflowManagerNotDeletedPipe} from "./pipes/workflowmanagernotdeletedpipe";

import /*embed*/ {WorkflowManager} from "./components/workflowmanager";
import /*embed*/ {WorkflowManagerDetail} from "./components/workflowmanagerdetail";
import /*embed*/ {WorkflowManagerDetailTasks} from "./components/workflowmanagerdetailtasks";
import /*embed*/ {WorkflowManagerDetailTasksLine} from "./components/workflowmanagerdetailtasksline";
import /*embed*/ {WorkflowManagerDetailTask} from "./components/workflowmanagerdetailtask";
import /*embed*/ {WorkflowManagerDetailTaskTaskpanel} from "./components/workflowmanagerdetailtasktaskpanel";
import /*embed*/ {WorkflowManagerDetailTaskDescriptionpanel} from "./components/workflowmanagerdetailtaskdescriptionpanel";
import /*embed*/ {WorkflowManagerTaskdropdown,filteractualpipe} from "./components/workflowmanagertaskdropdown";
import /*embed*/ {WorkflowManagerDetailTaskDecisions} from "./components/workflowmanagerdetailtaskdecisions";
import /*embed*/ {WorkflowManagerDetailTaskDecisionsLine} from "./components/workflowmanagerdetailtaskdecisionsline";
import /*embed*/ {WorkflowManagerDetailTaskAssignmentpanel} from "./components/workflowmanagerdetailtaskassignmentpanel";
import /*embed*/ {WorkflowManagerDetailTaskEmailpanel} from "./components/workflowmanagerdetailtaskemailpanel";
import /*embed*/ {WorkflowManagerDetailTaskSystemactionspanel} from "./components/workflowmanagerdetailtasksystemactionspanel";
import /*embed*/ {WorkflowManagerDetailTaskSystemactions} from "./components/workflowmanagerdetailtasksystemactions";
import /*embed*/ {WorkflowManagerDetailTaskSystemactionsLine} from "./components/workflowmanagerdetailtasksystemactionsline";
import /*embed*/ {WorkflowManagerDetailConditions} from "./components/workflowmanagerdetailconditions";
import /*embed*/ {WorkflowManagerDetailConditionsLine} from "./components/workflowmanagerdetailconditionsline";
import /*embed*/ {WorkflowManagerFieldsdropdown} from "./components/workflowmanagerfieldsdropdown";
import /*embed*/ {WorkflowPanel} from "./components/workflowpanel";

import /*embed*/ {WorkflowPanelHeader} from "./components/workflowpanelheader";
import /*embed*/ {WorkflowPanelItem} from "./components/workflowpanelitem";
import /*embed*/ {WorkflowPanelTasks} from "./components/workflowpaneltasks";
import /*embed*/ {WorkflowPanelTasksItem} from "./components/workflowpaneltasksitem";
import /*embed*/ {WorkflowPanelTask} from "./components/workflowpaneltask";
import /*embed*/ {WorkflowPanelTasksComments} from "./components/workflowpaneltaskscomments";
import /*embed*/ {WorkflowTasksDashlet} from "./components/workflowtasksdashlet";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        ObjectFields,
        DirectivesModule
    ],
    declarations: [
        WorkflowManager,
        WorkflowManagerDetail,
        WorkflowManagerDetailTasks,
        WorkflowManagerDetailTasksLine,
        WorkflowManagerDetailTask,
        WorkflowManagerDetailTaskTaskpanel,
        WorkflowManagerDetailTaskDescriptionpanel,
        WorkflowManagerTaskdropdown,
        filteractualpipe,
        WorkflowManagerDetailTaskDecisions,
        WorkflowManagerDetailTaskDecisionsLine,
        WorkflowManagerDetailTaskAssignmentpanel,
        WorkflowManagerDetailTaskEmailpanel,
        WorkflowManagerDetailTaskSystemactionspanel,
        WorkflowManagerDetailTaskSystemactions,
        WorkflowManagerDetailTaskSystemactionsLine,
        WorkflowManagerDetailConditions,
        WorkflowManagerDetailConditionsLine,
        WorkflowManagerFieldsdropdown,
        WorkflowPanel,
        WorkflowOpenWorkflowsPipe,
        WorkflowCompletedWorkflowsPipe,
        WorkflowManagerNotDeletedPipe,
        WorkflowMyOpenTasksPipe,
        WorkflowPanelHeader,
        WorkflowPanelItem,
        WorkflowPanelTasks,
        WorkflowPanelTasksItem,
        WorkflowPanelTasksComments,
        WorkflowPanelTask,
        WorkflowTasksDashlet
    ]
})
export class ModuleWorkflow {}

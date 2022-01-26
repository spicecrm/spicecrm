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

import /*embed*/ * as interfaces from "./interfaces/workflow.interfaces";
import /*embed*/ {workflow} from "./services/workflow.service";
import /*embed*/ {WorkflowManagerService} from "./services/workflowmanager.service";

import /*embed*/ {WorkflowMyOpenTasksPipe} from "./pipes/workflowmyopentaskspipe";
import /*embed*/ {WorkflowOpenWorkflowsPipe} from "./pipes/workflowopenworkflowspipe";
import /*embed*/ {WorkflowCompletedWorkflowsPipe} from "./pipes/workflowcompletedworkflowspipe";
import /*embed*/ {WorkflowManagerNotDeletedPipe} from "./pipes/workflowmanagernotdeletedpipe";

import /*embed*/ {WorkflowManagerTaskTypesStandard} from "./components/workflowmanagertasktypesstandard";
import /*embed*/ {WorkflowManagerTaskTypesEmail} from "./components/workflowmanagertasktypesemail";
import /*embed*/ {WorkflowManagerTaskTypesSystem} from "./components/workflowmanagertasktypessystem";
import /*embed*/ {WorkflowManagerTaskTypesDecision} from "./components/workflowmanagertasktypesdecision";
import /*embed*/ {WorkflowManagerTaskTypesSms} from "./components/workflowmanagertasktypessms";
import /*embed*/ {WorkflowManagerTaskNextTasks} from "./components/workflowmanagertasknexttasks";
import /*embed*/ {WorkflowManager} from "./components/workflowmanager";
import /*embed*/ {WorkflowManagerTaskTypesModal} from "./components/workflowmanagertasktypesmodal";
import /*embed*/ {WorkflowManagerDetailTasks} from "./components/workflowmanagerdetailtasks";
import /*embed*/ {WorkflowManagerDetailTasksLine} from "./components/workflowmanagerdetailtasksline";
import /*embed*/ {WorkflowManagerDetailTask} from "./components/workflowmanagerdetailtask";
import /*embed*/ {WorkflowManagerDetailTaskTaskpanel} from "./components/workflowmanagerdetailtasktaskpanel";
import /*embed*/ {WorkflowManagerDetailTaskAssignmentpanel} from "./components/workflowmanagerdetailtaskassignmentpanel";
import /*embed*/ {WorkflowManagerDetailTaskSystemactionsLine} from "./components/workflowmanagerdetailtasksystemactionsline";
import /*embed*/ {WorkflowManagerDetailConditions} from "./components/workflowmanagerdetailconditions";
import /*embed*/ {WorkflowPanel} from "./components/workflowpanel";

import /*embed*/ {WorkflowPanelHeader} from "./components/workflowpanelheader";
import /*embed*/ {WorkflowPanelItem} from "./components/workflowpanelitem";
import /*embed*/ {WorkflowPanelTasks} from "./components/workflowpaneltasks";
import /*embed*/ {WorkflowPanelTasksItem} from "./components/workflowpaneltasksitem";
import /*embed*/ {WorkflowPanelTask} from "./components/workflowpaneltask";
import /*embed*/ {WorkflowPanelTasksComments} from "./components/workflowpaneltaskscomments";
import /*embed*/ {WorkflowTasksDashlet} from "./components/workflowtasksdashlet";
import /*embed*/ {fieldWorkflowTaskName} from "./fields/fieldworkflowtaskname";
import /*embed*/ {WorkflowPanelTaskStandard} from "./components/workflowpaneltaskstandard";
import /*embed*/ {WorkflowPanelTaskDecision} from "./components/workflowpaneltaskdecision";

import /*embed*/ {WorkflowCloseWorkflowButton} from "./components/workflowcloseworkflowbutton";
import /*embed*/ {WorkflowManagerFieldsdropdown} from "./components/workflowmanagerfieldsdropdown";
import /*embed*/ {WorkflowManagerDetailConditionsLine} from "./components/workflowmanagerdetailconditionsline";
import {WorkflowManagerTaskEditModal} from "./components/workflowmanagertaskteditmodal";
import {WorkflowManagerEditModal} from "./components/workflowmanagereditmodal";
import {WorkflowManagerTaskTypesStart} from "./components/workflowmanagertasktypesstart";
import {WorkflowManagerTaskTypesEnd} from "./components/workflowmanagertasktypesend";

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
        WorkflowManagerDetailConditionsLine,
        WorkflowManager,
        WorkflowManagerTaskTypesModal,
        WorkflowManagerDetailTasks,
        WorkflowManagerDetailTasksLine,
        WorkflowManagerDetailTask,
        WorkflowManagerDetailTaskTaskpanel,
        WorkflowManagerDetailTaskAssignmentpanel,
        WorkflowManagerDetailTaskSystemactionsLine,
        WorkflowManagerDetailConditions,
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
        WorkflowTasksDashlet,
        WorkflowCloseWorkflowButton,
        fieldWorkflowTaskName,
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
        WorkflowManagerTaskTypesEnd
    ]
})
export class ModuleWorkflow {
}

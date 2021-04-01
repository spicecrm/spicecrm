/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

import /*embed*/ {WorkflowCloseWorkflowButton} from "./components/workflowcloseworkflowbutton";

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
        WorkflowTasksDashlet,
        WorkflowCloseWorkflowButton
    ]
})
export class ModuleWorkflow {}

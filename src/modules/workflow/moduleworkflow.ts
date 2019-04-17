/**
 * @module ModuleWorkflow
 */
import {CommonModule,} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';

import {metadata} from '../../services/metadata.service';
import {VersionManagerService} from '../../services/versionmanager.service';

import { SystemComponents}      from '../../systemcomponents/systemcomponents';
import { ObjectComponents}      from '../../objectcomponents/objectcomponents';
import { ObjectFields}      from '../../objectfields/objectfields';

import /*embed*/ {workflow} from "./services/workflow.service";

import /*embed*/ {WorkflowManager, notdeletedpipe} from "./components/workflowmanager";
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

import /*embed*/ {WorkflowPanel, openworkflowspipe, myopentaskspipe} from "./components/workflowpanel";
import /*embed*/ {WorkflowPanelHeader} from "./components/workflowpanelheader";
import /*embed*/ {WorkflowPanelItem} from "./components/workflowpanelitem";
import /*embed*/ {WorkflowPanelTasks} from "./components/workflowpaneltasks";
import /*embed*/ {WorkflowPanelTask} from "./components/workflowpaneltask";
import /*embed*/ {WorkflowPanelTaskComments} from "./components/workflowpaneltaskcomments";

import /*embed*/ {WorkflowTasksDashlet} from "./components/workflowtasksdashlet";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        ObjectComponents,
        ObjectFields
    ],
    declarations: [
        WorkflowManager,
        notdeletedpipe,
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
        openworkflowspipe,
        myopentaskspipe,
        WorkflowPanelHeader,
        WorkflowPanelItem,
        WorkflowPanelTasks,
        WorkflowPanelTask,
        WorkflowPanelTaskComments,
        WorkflowTasksDashlet
    ]
})
export class ModuleWorkflow {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}

/**
 * @module ModuleActivities
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {TasksManagerView} from './components/tasksmanagerview';
import /*embed*/ {TasksManagerTasks} from './components/tasksmanagertasks';
import /*embed*/ {TasksManagerTask} from './components/tasksmanagertask';
import /*embed*/ {TasksManagerTaskDetails} from './components/tasksmanagertaskdetails';
import /*embed*/ {TasksAssitantTileClose} from './components/tasksassitanttileclose';

import /*embed*/ {ActivityTimelineSaveButton} from "./components/activitytimelinesavebutton";
import /*embed*/ {ActionActivityCloseButton} from "./components/actionactivityclosebutton";
import /*embed*/ {ActionActivityCloseCreateButton} from "./components/actionactivityclosecreatebutton";
import /*embed*/ {ActivityCloseModal} from "./components/activityclosemodal";
import /*embed*/ {ActivityCloseCreateModal} from "./components/activityclosecreatemodal";

import /*embed*/ {ActivitiesPopoverAddBar} from "./components/activitiespopoveraddbar";
import /*embed*/ {ActivitiesPopoverAddBarButton} from "./components/activitiespopoveraddbarbutton";
import /*embed*/ {fieldActivitiesAddActions} from "./fields/fieldactivitiesaddactions";
import /*embed*/ {fieldActivitiesAddActionsButton} from "./fields/fieldactivitiesaddactionsbutton";
import /*embed*/ {fieldActivitiesTaskWithCloseCheckbox} from "./fields/fieldactivitiestaskwithclosecheckbox";
import /*embed*/ {fieldActivityReminder} from "./fields/fieldactivityreminder";

import /*embed*/ {ActivityParticipationPanel} from "./components/activityparticipationpanel";
import /*embed*/ {fieldActivityParticipationPanel} from "./fields/fieldactivityparticipationpanel";
import /*embed*/ {ActivityParticipationPanelHeader} from "./components/activityparticipationpanelheader";
import /*embed*/ {ActivityParticipationPanelParticipant} from "./components/activityparticipationpanelparticipant";
import /*embed*/ {ActivityParticipationStatus} from "./components/activityparticipationstatus";
import /*embed*/ {fieldActivityParticipationStatus} from "./fields/fieldactivityparticipationstatus";
import /*embed*/ {fieldActivityCurrentUserParticipationStatus} from "./fields/fieldactivitycurrentuserparticipationstatus";

import /*embed*/ {ActivityTimeline} from './components/activitytimeline';
import /*embed*/ {ActivityTimelineTabbed} from './components/activitytimelinetabbed';
import /*embed*/ {ActivityTimelineDropZoneWrapper} from './components/activitytimelinedropzonewrapper';
import /*embed*/ {ActivityTimelineFilter} from "./components/activitytimelinefilter";
import /*embed*/ {ActivityTimelineContainer} from './components/activitytimelinecontainer';
import /*embed*/ {ActivityTimelineItemContainer} from './components/activitytimelineitemcontainer';
import /*embed*/ {ActivityTimelineItem} from './components/activitytimelineitem';
import /*embed*/ {ActivityTimelineStencil} from './components/activitytimelinestencil';
import /*embed*/ {ActivityTimelineAddContainer} from './components/activitytimelineaddcontainer';
import /*embed*/ {ActivityTimelineAddItem} from './components/activitytimelineadditem';
import /*embed*/ {ActivityTimelineAddEmail} from './components/activitytimelineaddemail';
import /*embed*/ {ActivityTimelineSummary} from './components/activitytimelinesummary';
import /*embed*/ {ActivityTimelineAggregates} from './components/activitytimelineaggregates';
import /*embed*/ {ActivityTimelineSummaryItemView} from './components/activitytimelinesummaryitemview';
import /*embed*/ {ActivityTimelineSummaryButton} from './components/activitytimelinesummarybutton';
import /*embed*/ {ActivityTimelineSummaryAggregates} from './components/activitytimelinesummaryaggregates';

import /*embed*/ {fieldActivityDate} from './fields/fieldactivitydate';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        TasksManagerView,
        TasksManagerTasks,
        TasksManagerTask,
        TasksManagerTaskDetails,
        TasksAssitantTileClose,
        ActivityTimelineSaveButton,
        ActionActivityCloseButton,
        ActionActivityCloseCreateButton,
        ActivityCloseModal,
        ActivityCloseCreateModal,
        ActivitiesPopoverAddBar,
        ActivitiesPopoverAddBarButton,
        fieldActivitiesAddActions,
        fieldActivitiesAddActionsButton,
        fieldActivitiesTaskWithCloseCheckbox,
        fieldActivityParticipationPanel,
        fieldActivityReminder,
        ActivityParticipationPanel,
        ActivityParticipationPanelHeader,
        ActivityParticipationPanelParticipant,
        ActivityParticipationStatus,
        fieldActivityParticipationStatus,
        fieldActivityCurrentUserParticipationStatus,
        ActivityTimeline,
        ActivityTimelineTabbed,
        ActivityTimelineDropZoneWrapper,
        ActivityTimelineFilter,
        ActivityTimelineContainer,
        ActivityTimelineItemContainer,
        ActivityTimelineItem,
        ActivityTimelineStencil,
        ActivityTimelineAddContainer,
        ActivityTimelineAddItem,
        ActivityTimelineAddEmail,
        ActivityTimelineSummary,
        ActivityTimelineAggregates,
        ActivityTimelineSummaryItemView,
        ActivityTimelineSummaryButton,
        ActivityTimelineSummaryAggregates,
        fieldActivityDate
    ],
    exports: [
        ActivityTimelineItemContainer,
        ActivityTimelineStencil
    ]
})
export class ModuleActivities {}

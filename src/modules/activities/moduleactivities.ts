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

import {TasksManagerView} from './components/tasksmanagerview';
import {TasksManagerTasks} from './components/tasksmanagertasks';
import {TasksManagerTask} from './components/tasksmanagertask';
import {TasksManagerTaskDetails} from './components/tasksmanagertaskdetails';
import {TasksAssitantTileClose} from './components/tasksassitanttileclose';

import {ActivityTimelineSaveButton} from "./components/activitytimelinesavebutton";
import {ActionActivityCloseButton} from "./components/actionactivityclosebutton";
import {ActionActivityCloseCreateButton} from "./components/actionactivityclosecreatebutton";
import {ActivityCloseModal} from "./components/activityclosemodal";
import {ActivityCloseCreateModal} from "./components/activityclosecreatemodal";

import {ActivitiesPopoverAddBar} from "./components/activitiespopoveraddbar";
import {ActivitiesPopoverAddBarButton} from "./components/activitiespopoveraddbarbutton";
import {fieldActivitiesAddActions} from "./fields/fieldactivitiesaddactions";
import {fieldActivitiesAddActionsButton} from "./fields/fieldactivitiesaddactionsbutton";
import {fieldActivitiesTaskWithCloseCheckbox} from "./fields/fieldactivitiestaskwithclosecheckbox";
import {fieldActivityReminder} from "./fields/fieldactivityreminder";

import {ActivityParticipationPanel} from "./components/activityparticipationpanel";
import {fieldActivityParticipationPanel} from "./fields/fieldactivityparticipationpanel";
import {ActivityParticipationPanelHeader} from "./components/activityparticipationpanelheader";
import {ActivityParticipationPanelParticipant} from "./components/activityparticipationpanelparticipant";
import {ActivityParticipationStatus} from "./components/activityparticipationstatus";
import {fieldActivityParticipationStatus} from "./fields/fieldactivityparticipationstatus";
import {fieldActivityCurrentUserParticipationStatus} from "./fields/fieldactivitycurrentuserparticipationstatus";

import {ActivityTimeline} from './components/activitytimeline';
import {ActivityTimelineTabbed} from './components/activitytimelinetabbed';
import {ActivityTimelineDropZoneWrapper} from './components/activitytimelinedropzonewrapper';
import {ActivityTimelineFilter} from "./components/activitytimelinefilter";
import {ActivityTimelineContainer} from './components/activitytimelinecontainer';
import {ActivityTimelineItemContainer} from './components/activitytimelineitemcontainer';
import {ActivityTimelineItem} from './components/activitytimelineitem';
import {ActivityTimelineStencil} from './components/activitytimelinestencil';
import {ActivityTimelineAddContainer} from './components/activitytimelineaddcontainer';
import {ActivityTimelineAddItem} from './components/activitytimelineadditem';
import {ActivityTimelineAddEmail} from './components/activitytimelineaddemail';
import {ActivityTimelineSummary} from './components/activitytimelinesummary';
import {ActivityTimelineAggregates} from './components/activitytimelineaggregates';
import {ActivityTimelineSummaryItemView} from './components/activitytimelinesummaryitemview';
import {ActivityTimelineSummaryButton} from './components/activitytimelinesummarybutton';
import {ActivityTimelineSummaryAggregates} from './components/activitytimelinesummaryaggregates';

import {fieldActivityDate} from './fields/fieldactivitydate';

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

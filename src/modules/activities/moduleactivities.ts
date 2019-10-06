/**
 * @module ModuleActivities
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {TasksManager} from './components/tasksmanager';
import /*embed*/ {TasksManagerView} from './components/tasksmanagerview';
import /*embed*/ {TasksManagerHeader} from './components/tasksmanagerheader';
import /*embed*/ {TasksManagerTasks} from './components/tasksmanagertasks';
import /*embed*/ {TasksManagerTask} from './components/tasksmanagertask';
import /*embed*/ {TasksManagerTaskDetails} from './components/tasksmanagertaskdetails';
import /*embed*/ {TasksAssitantTileClose} from './components/tasksassitanttileclose';

import /*embed*/ {EmailsPopoverBody} from "./components/emailspopoverbody";

import /*embed*/ {ActionActivityCloseButton} from "./components/actionactivityclosebutton";
import /*embed*/ {ActionActivityCloseCreateButton} from "./components/actionactivityclosecreatebutton";
import /*embed*/ {ActivityCloseModal} from "./components/activityclosemodal";
import /*embed*/ {ActivityCloseCreateModal} from "./components/activityclosecreatemodal";

import /*embed*/ {ActivitiesPopoverAddBar} from "./components/activitiespopoveraddbar";
import /*embed*/ {ActivitiesPopoverAddBarButton} from "./components/activitiespopoveraddbarbutton";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        TasksManager,
        TasksManagerView,
        TasksManagerHeader,
        TasksManagerTasks,
        TasksManagerTask,
        TasksManagerTaskDetails,
        TasksAssitantTileClose,
        EmailsPopoverBody,
        ActionActivityCloseButton,
        ActionActivityCloseCreateButton,
        ActivityCloseModal,
        ActivityCloseCreateModal,
        ActivitiesPopoverAddBar,
        ActivitiesPopoverAddBarButton
    ]
})
export class ModuleActivities {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
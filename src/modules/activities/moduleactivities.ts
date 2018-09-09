import {CommonModule} from '@angular/common';
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule}   from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';

import {Subject, Observable} from 'rxjs';


import {loginService, loginCheck} from '../../services/login.service';
import {metadata, aclCheck} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modelutilities} from '../../services/modelutilities.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {assistant} from '../../services/assistant.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {toast} from '../../services/toast.service';
import {fts} from '../../services/fts.service';
import {configurationService} from '../../services/configuration.service';
import {mediafiles} from '../../services/mediafiles.service';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {GlobalUtilityComponents}      from '../../globalutilitycomponents/globalutilitycomponents';

import /*embed*/ {TasksManager} from './components/tasksmanager';
import /*embed*/ {TasksManagerView} from './components/tasksmanagerview';
import /*embed*/ {TasksManagerHeader} from './components/tasksmanagerheader';
import /*embed*/ {TasksManagerTasks} from './components/tasksmanagertasks';
import /*embed*/ {TasksManagerTask} from './components/tasksmanagertask';
import /*embed*/ {TasksManagerTaskDetails} from './components/tasksmanagertaskdetails';
import /*embed*/ {TasksAssitantTileClose} from './components/tasksassitanttileclose';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents,
    ],
    declarations: [
        TasksManager,
        TasksManagerView,
        TasksManagerHeader,
        TasksManagerTasks,
        TasksManagerTask,
        TasksManagerTaskDetails,
        TasksAssitantTileClose
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
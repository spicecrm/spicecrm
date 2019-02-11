import {CommonModule} from '@angular/common';
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    AfterViewChecked,
    Renderer,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    Injectable,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnInit,
    OnDestroy,
    OnChanges,
    ChangeDetectorRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';

import {Subject, Observable} from 'rxjs';


import {loginService, loginCheck} from '../../services/login.service';
import {metadata, aclCheck} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
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
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import /*embed*/ {telecockpitservice} from "./services/telecockpit.service";

import /*embed*/ {TeleSalesCockpitList} from './components/telesalescockpitlist';
import /*embed*/ {TeleSalesCockpitListItem} from './components/telesalescockpitlistitem';
import /*embed*/ {TeleSalesCockpitMain} from './components/telesalescockpitmain';
import /*embed*/ {TeleSalesCockpitCreateLeadButton} from './components/telesalescockpitcreateleadbutton';
import /*embed*/ {TeleSalesCockpitLogCallButton} from './components/telesalescockpitlogcallbutton';
import /*embed*/ {TeleSalesCockpitCompleteButton} from './components/telesalescockpitcompletebutton';
import /*embed*/ {TeleSalesCockpitAddAttemptButton} from './components/telesalescockpitaddattemptbutton';
import /*embed*/ {TeleSalesCockpitAddAttemptModal} from './components/telesalescockpitaddattemptmodal';
import /*embed*/ {TeleSalesCockpitModuleActions} from './components/telesalescockpitmoduleactions';
import /*embed*/ {TeleSalesCockpitAddMeetingButton} from './components/telesalescockpitaddmeetingbutton';
import /*embed*/ {TeleSalesCockpit} from './components/telesalescockpit';

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
        TeleSalesCockpit,
        TeleSalesCockpitList,
        TeleSalesCockpitMain,
        TeleSalesCockpitListItem,
        TeleSalesCockpitCreateLeadButton,
        TeleSalesCockpitLogCallButton,
        TeleSalesCockpitCompleteButton,
        TeleSalesCockpitAddAttemptButton,
        TeleSalesCockpitAddAttemptModal,
        TeleSalesCockpitModuleActions,
        TeleSalesCockpitAddMeetingButton,

    ],
    providers: [
        telecockpitservice
    ]
})
export class ModuleTeleSales {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(private vms: VersionManagerService,) {
        this.vms.registerModule(this);
    }
}
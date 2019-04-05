import {
    Component,
    Injectable,
    Input,
    OnInit,
    ChangeDetectorRef,
    enableProdMode,
    SystemJsNgModuleLoader
} from '@angular/core';
import {NgModule} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {BrowserModule, Title} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {HttpClientModule, HttpHeaders, HttpClient} from "@angular/common/http";
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {Subject, Observable} from 'rxjs';


// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
// import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {DirectivesModule} from "../../directives/directives";
/*
// various services we need on global app level
import {configurationService} from "../services/configuration.service";
import {loginService, loginCheck} from "../services/login.service";
import {session} from "../services/session.service";
import {metadata, aclCheck} from "../services/metadata.service";
import {AppDataService} from "../services/appdata.service";
import {MathExpressionCompilerService} from "../services/mathexpressioncompiler";
import {language} from "../services/language.service";
import {recent} from "../services/recent.service";
import {userpreferences} from "../services/userpreferences.service";
import {fts} from "../services/fts.service";
import {loader} from "../services/loader.service";
import {broadcast} from "../services/broadcast.service";
import {dockedComposer} from "../services/dockedcomposer.service";
import {backend} from "../services/backend.service";
import {navigation} from "../services/navigation.service";
import {modelutilities} from "../services/modelutilities.service";
import {toast} from "../services/toast.service";
import {favorite} from "../services/favorite.service";
import {reminder} from "../services/reminder.service";
import {territories} from "../services/territories.service";
import {currency} from "../services/currency.service";
import {footer} from "../services/footer.service";
import {cookie} from "../services/cookie.service";
import {assistant} from "../services/assistant.service";
import {VersionManagerService} from "../services/versionmanager.service";
import {modal} from "../services/modal.service";
import {layout} from "../services/layout.service";
*/

import /*embed*/ {GroupwareService} from '../groupware/services/groupware.service';

import /*embed*/ {GroupwarePaneBean} from './components/groupwarepanebean';
import /*embed*/ {GroupwarePaneAttachment} from './components/groupwarepaneattachment';
import /*embed*/ {GroupwareReadPane} from './components/groupwarereadpane';
import /*embed*/ {GroupwareReadPaneAttachments} from './components/groupwarereadpaneattachments';
import /*embed*/ {GroupwareReadPaneBeans} from './components/groupwarereadpanebeans';
import /*embed*/ {GroupwareReadPaneLinked} from './components/groupwarereadpanelinked';
import /*embed*/ {GroupwareReadPaneSearch} from './components/groupwarereadpanesearch';
import /*embed*/ {GroupwareDetailPane} from './components/groupwaredetailpane';
import /*embed*/ {GroupwareDetailPaneBean} from './components/groupwaredetailpanebean';
import {loginCheck} from "../../services/login.service";

declare var Office: any;

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SystemComponents,
        // GlobalComponents,
        ObjectComponents,
        DirectivesModule,
        RouterModule.forRoot([
            {path: 'mailitem', component: GroupwareReadPane, canActivate: [loginCheck]},
            {path: 'details', component: GroupwareDetailPane, canActivate: [loginCheck]},
        ])
    ],
    declarations: [
        GroupwarePaneBean,
        GroupwarePaneAttachment,
        GroupwareReadPane,
        GroupwareReadPaneAttachments,
        GroupwareReadPaneBeans,
        GroupwareReadPaneLinked,
        GroupwareReadPaneSearch,
        GroupwareDetailPane,
        GroupwareDetailPaneBean,
    ],
    providers: [
        /*
        // gobal items
        backend,
        broadcast,
        layout,
        navigation,
        session,
        metadata,
        AppDataService,
        aclCheck,
        loginCheck,
        loginService,
        loader,
        configurationService,
        language,
        dockedComposer,
        fts,
        recent,
        SystemJsNgModuleLoader,
        modelutilities,
        toast,
        favorite,
        reminder,
        territories,
        currency,
        footer,
        userpreferences,
        cookie,
        MathExpressionCompilerService,
        assistant,
        VersionManagerService,
        modal,
        Title
        */
    ]
})
export default class ModuleGroupware {
}

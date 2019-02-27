import {CommonModule} from "@angular/common";
import {AfterViewInit, ChangeDetectorRef, HostListener, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule}   from "@angular/forms";
import {RouterModule, Routes, Router, ActivatedRoute} from "@angular/router";

import {Subject, Observable, of} from "rxjs";


import {loginService, loginCheck} from "../../services/login.service";
import {metadata, aclCheck} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {modellist} from "../../services/modellist.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {modelutilities} from "../../services/modelutilities.service";
import {userpreferences} from "../../services/userpreferences.service";
import {helper} from "../../services/helper.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {navigation} from "../../services/navigation.service";
import {backend} from "../../services/backend.service";
import {session} from "../../services/session.service";
import {footer} from "../../services/footer.service";
import {assistant} from "../../services/assistant.service";
import {view} from "../../services/view.service";
import {popup} from "../../services/popup.service";
import {toast} from "../../services/toast.service";
import {fts} from "../../services/fts.service";
import {recent} from "../../services/recent.service";
import {configurationService} from "../../services/configuration.service";
import {dockedComposer} from '../../services/dockedcomposer.service';

import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {AsteriskToolbarIndicator} from "./components/asterisktoolbarindicator";


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
        AsteriskToolbarIndicator
    ],
    providers: [userpreferences]
})
export class ModuleAsterisk {
    public version = "1.0";
    public build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
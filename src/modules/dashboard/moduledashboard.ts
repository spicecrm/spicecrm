import {CommonModule} from "@angular/common";
import {FormsModule}   from "@angular/forms";
import {Component, Input, NgModule, AfterViewInit, OnInit, OnDestroy, OnChanges, Renderer, ElementRef, ViewChild, ViewContainerRef, Injectable, EventEmitter, Renderer2} from "@angular/core";
import {RouterModule, Router, Routes} from "@angular/router";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

declare var moment: any;

import {loginCheck} from "../../services/login.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {modellist} from "../../services/modellist.service";
import {modelutilities} from "../../services/modelutilities.service";
import {view} from "../../services/view.service";
import {fts} from "../../services/fts.service";
import {recent} from "../../services/recent.service";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {reminder} from "../../services/reminder.service";
import {navigation} from "../../services/navigation.service";
import {userpreferences} from "../../services/userpreferences.service";
import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields}      from "../../objectfields/objectfields";
import {SystemComponents}      from "../../systemcomponents/systemcomponents";
import {GlobalUtilityComponents}      from "../../globalutilitycomponents/globalutilitycomponents";

import /*embed*/ {dashboardlayout} from "./services/dashboardlayout.service";
import /*embed*/ { DashboardView } from "./components/dashboardview";
import /*embed*/ { DashboardContainer } from "./components/dashboardcontainer";
import /*embed*/ { DashboardContainerHeader } from "./components/dashboardcontainerheader";
import /*embed*/ { DashboardContainerHomeHeader } from "./components/dashboardcontainerhomeheader";
import /*embed*/ { DashboardContainerBody } from "./components/dashboardcontainerbody";
import /*embed*/ { DashboardContainerElement } from "./components/dashboardcontainerelement";
import /*embed*/ { DashboardAddElement } from "./components/dashboardaddelement";
import /*embed*/ { DashboardWeatherDashlet } from "./components/dashboardweatherdashlet";
import /*embed*/ { DashboardGenericDashlet } from "./components/dashboardgenericdashlet";
import /*embed*/ { DashboardGenericDashletRow } from "./components/dashboardgenericdashletrow";
import /*embed*/ { DashboardRemindersDashlet } from "./components/dashboardremindersdashlet";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        SystemComponents,
        GlobalUtilityComponents
        ],
    declarations: [
        DashboardView,
        DashboardContainer,
        DashboardContainerHeader,
        DashboardContainerHomeHeader,
        DashboardContainerBody,
        DashboardContainerElement,
        DashboardAddElement,
        DashboardWeatherDashlet,
        DashboardGenericDashlet,
        DashboardGenericDashletRow,
        DashboardRemindersDashlet,
    ],
    entryComponents: [
        DashboardWeatherDashlet
    ],
    exports: [
        DashboardContainer,
    ]
})
export class ModuleDashboard {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
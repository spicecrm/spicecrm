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

import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ { calendar } from "./services/calendar.service";

import /*embed*/ {Calendar} from "./components/calendar";
import /*embed*/ {CalendarDatePicker} from "./components/calendardatepicker";
import /*embed*/ {CalendarSheetDay} from "./components/calendarsheetday";
import /*embed*/ {CalendarSheetWeek} from "./components/calendarsheetweek";
import /*embed*/ {CalendarSheetMonth} from "./components/calendarsheetmonth";
import /*embed*/ {CalendarSheetSchedule} from "./components/calendarsheetschedule";
import /*embed*/ {CalendarSheetEvent} from "./components/calendarsheetevent";
import /*embed*/ {CalendarEventSummary} from "./components/calendareventsummary";
import /*embed*/ {CalendarSheetDropTarget} from "./components/calendarsheetdroptarget";
import /*embed*/ {CalendarMorePopover} from "./components/calendarmorepopover";
import /*embed*/ {CalendarMorePopoverEvent} from "./components/calendarmorepopoverevent";
import /*embed*/ {CalendarMoreButton} from "./components/calendarmorebutton";


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
        Calendar,
        CalendarDatePicker,
        CalendarSheetDay,
        CalendarSheetWeek,
        CalendarSheetMonth,
        CalendarSheetSchedule,
        CalendarSheetEvent,
        CalendarEventSummary,
        CalendarSheetDropTarget,
        CalendarMorePopover,
        CalendarMorePopoverEvent,
        CalendarMoreButton,
    ],
    providers: [userpreferences]
})
export class ModuleCalendar {
    public version = "1.0";
    public build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
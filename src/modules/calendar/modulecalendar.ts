/**
 * @module ModuleCalendar
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";

import {userpreferences} from "../../services/userpreferences.service";

import {VersionManagerService} from "../../services/versionmanager.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ { calendar } from "./services/calendar.service";

import /*embed*/ {CalendarHeader} from "./components/calendarheader";
import /*embed*/ {Calendar} from "./components/calendar";
import /*embed*/ {CalendarSheetDay} from "./components/calendarsheetday";
import /*embed*/ {CalendarSheetThreeDays} from "./components/calendarsheetthreedays";
import /*embed*/ {CalendarSheetWeek} from "./components/calendarsheetweek";
import /*embed*/ {CalendarSheetMonth} from "./components/calendarsheetmonth";
import /*embed*/ {CalendarSheetSchedule} from "./components/calendarsheetschedule";
import /*embed*/ {CalendarSheetEvent} from "./components/calendarsheetevent";
import /*embed*/ {CalendarSheetDropTarget} from "./components/calendarsheetdroptarget";
import /*embed*/ {CalendarMorePopover} from "./components/calendarmorepopover";
import /*embed*/ {CalendarMoreButton} from "./components/calendarmorebutton";
import /*embed*/ {CalendarAddCalendar} from "./components/calendaraddcalendar";
import /*embed*/ {CalendarAddModulesModal} from "./components/calendaraddmodulesmodal";
import /*embed*/ {CalendarOtherCalendarsMonitor} from "./components/calendarothercalendarsmonitor";
import /*embed*/ {CalendarColorPicker} from "./components/calendarcolorpicker";
import /*embed*/ {CalendarScheduleDashlet} from "./components/calendarscheduledashlet";
import /*embed*/ {CalendarDayDashlet} from "./components/calendardaydashlet";
import /*embed*/ {CalendarThreeDaysDashlet} from "./components/calendarthreedaysdashlet";


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
        CalendarHeader,
        CalendarSheetDay,
        CalendarSheetThreeDays,
        CalendarSheetWeek,
        CalendarSheetMonth,
        CalendarSheetSchedule,
        CalendarSheetEvent,
        CalendarSheetDropTarget,
        CalendarMorePopover,
        CalendarMoreButton,
        CalendarAddCalendar,
        CalendarAddModulesModal,
        CalendarOtherCalendarsMonitor,
        CalendarColorPicker,
        CalendarScheduleDashlet,
        CalendarDayDashlet,
        CalendarThreeDaysDashlet
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

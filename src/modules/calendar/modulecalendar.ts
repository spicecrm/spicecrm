/**
 * @module ModuleCalendar
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule}   from "@angular/forms";
import {DragDropModule} from "@angular/cdk/drag-drop";

import {userpreferences} from "../../services/userpreferences.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ { calendar } from "./services/calendar.service";

import /*embed*/ {CalendarHeader} from "./components/calendarheader";
import /*embed*/ {CalendarSheetDropTarget} from "./components/calendarsheetdroptarget";
import /*embed*/ {Calendar} from "./components/calendar";
import /*embed*/ {CalendarSheetEvent} from "./components/calendarsheetevent";
import /*embed*/ {CalendarSheetGoogleEvent} from "./components/calendarsheetgoogleevent";
import /*embed*/ {CalendarSheetDay} from "./components/calendarsheetday";
import /*embed*/ {CalendarSheetWeek} from "./components/calendarsheetweek";
import /*embed*/ {CalendarSheetThreeDays} from "./components/calendarsheetthreedays";
import /*embed*/ {CalendarSheetMonth} from "./components/calendarsheetmonth";
import /*embed*/ {CalendarSheetSchedule} from "./components/calendarsheetschedule";
import /*embed*/ {CalendarMorePopover} from "./components/calendarmorepopover";
import /*embed*/ {CalendarGoogleEventPopover} from "./components/calendargoogleeventpopover";
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
        DirectivesModule,
        DragDropModule
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
        CalendarSheetGoogleEvent,
        CalendarSheetDropTarget,
        CalendarMorePopover,
        CalendarGoogleEventPopover,
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
export class ModuleCalendar {}

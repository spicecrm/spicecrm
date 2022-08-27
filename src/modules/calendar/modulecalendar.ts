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

import { calendar } from "./services/calendar.service";

import {CalendarHeader} from "./components/calendarheader";
import {CalendarSheetDropTarget} from "./components/calendarsheetdroptarget";
import {Calendar} from "./components/calendar";
import {CalendarSheetEvent} from "./components/calendarsheetevent";
import {CalendarSheetGoogleEvent} from "./components/calendarsheetgoogleevent";
import {CalendarSheetDay} from "./components/calendarsheetday";
import {CalendarSheetWeek} from "./components/calendarsheetweek";
import {CalendarSheetThreeDays} from "./components/calendarsheetthreedays";
import {CalendarSheetMonth} from "./components/calendarsheetmonth";
import {CalendarSheetSchedule} from "./components/calendarsheetschedule";
import {CalendarMorePopover} from "./components/calendarmorepopover";
import {CalendarGoogleEventPopover} from "./components/calendargoogleeventpopover";
import {CalendarMoreButton} from "./components/calendarmorebutton";
import {CalendarAddCalendar} from "./components/calendaraddcalendar";
import {CalendarAddModulesModal} from "./components/calendaraddmodulesmodal";
import {CalendarOtherCalendarsMonitor} from "./components/calendarothercalendarsmonitor";
import {CalendarColorPicker} from "./components/calendarcolorpicker";
import {CalendarScheduleDashlet} from "./components/calendarscheduledashlet";
import {CalendarDayDashlet} from "./components/calendardaydashlet";
import {CalendarThreeDaysDashlet} from "./components/calendarthreedaysdashlet";
import {CalendarSheetMicrosoftEvent} from "./components/calendarsheetmicrosoftevent";
import {CalendarMicrosoftEventPopover} from "./components/calendarmicrosofteventpopover";


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
        CalendarThreeDaysDashlet,
        CalendarSheetMicrosoftEvent,
        CalendarMicrosoftEventPopover
    ],
    providers: [userpreferences]
})
export class ModuleCalendar {}

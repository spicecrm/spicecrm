/**
 * @module ModuleHolidayCalendars
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {HolidayCalendarList} from "./components/holidaycalendarlist";
import /*embed*/ {HolidayCalendarListDays} from "./components/holidaycalendarlistdays";
import /*embed*/ {HolidayCalendarListGetHolidaysModal} from "./components/holidaycalendarlistgetholidaysmodal";
import /*embed*/ {HolidayCalendarListGetHolidaysButton} from "./components/holidaycalendarlistgetholidaysbutton";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        HolidayCalendarList,
        HolidayCalendarListDays,
        HolidayCalendarListGetHolidaysModal,
        HolidayCalendarListGetHolidaysButton
    ]
})
export class ModuleHolidayCalendars {

}

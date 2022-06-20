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

import {HolidayCalendarList} from "./components/holidaycalendarlist";
import {HolidayCalendarListDays} from "./components/holidaycalendarlistdays";
import {HolidayCalendarListGetHolidaysModal} from "./components/holidaycalendarlistgetholidaysmodal";
import {HolidayCalendarListGetHolidaysButton} from "./components/holidaycalendarlistgetholidaysbutton";

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
    exports: [
        HolidayCalendarListDays
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

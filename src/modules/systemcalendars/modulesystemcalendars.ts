/**
 * @module SystemHolidayCalendars
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {SystemCalendarList} from "./components/systemcalendarlist";
import /*embed*/ {SystemCalendarListDays} from "./components/systemcalendarlistdays";
import /*embed*/ {SystemCalendarListGetHolidaysModal} from "./components/systemcalendarlistgetholidaysmodal";
import /*embed*/ {SystemCalendarListGetHolidaysButton} from "./components/systemcalendarlistgetholidaysbutton";

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
        SystemCalendarList,
        SystemCalendarListDays,
        SystemCalendarListGetHolidaysModal,
        SystemCalendarListGetHolidaysButton
    ]
})
export class ModuleSystemCalendars {

}

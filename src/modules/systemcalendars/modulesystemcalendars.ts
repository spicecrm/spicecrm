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

import {SystemCalendarList} from "./components/systemcalendarlist";
import {SystemCalendarListDays} from "./components/systemcalendarlistdays";
import {SystemCalendarListGetHolidaysModal} from "./components/systemcalendarlistgetholidaysmodal";
import {SystemCalendarListGetHolidaysButton} from "./components/systemcalendarlistgetholidaysbutton";

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

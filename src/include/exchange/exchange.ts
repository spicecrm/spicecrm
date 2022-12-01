/**
 * @module ModuleExchange
 */
import {CommonModule} from "@angular/common";
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

// spicecrm generic modules
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";

// import embedding components
import {ExchangeUserSettings} from "./components/exchangeusersettings";
import {DirectivesModule} from "../../directives/directives";
import {MSGraphMappingModal} from "./components/msgraphmappingmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents,
        DirectivesModule
    ],
    declarations: [
        ExchangeUserSettings,
        MSGraphMappingModal
    ]
})
export class ModuleExchange {
}

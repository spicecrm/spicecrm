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
import {GSuiteUserSettings} from "./components/gsuiteusersettings";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        GlobalComponents,
        ObjectComponents
    ],
    declarations: [
        GSuiteUserSettings
    ]
})
export class ModuleGSuiteSettings {
}

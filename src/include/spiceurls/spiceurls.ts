/**
 * @module ModuleSpiceUrls
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {SpiceUrlsPanel} from "./components/spiceurlspanel";
import {SpiceUrlsPanelHeader} from "./components/spiceurlspanelheader";
import {SpiceUrlsList} from "./components/spiceurlslist";
import {SpiceUrlItem} from "./components/spiceurlitem";
import {SpiceUrlsEditModal} from "./components/spiceurlseditmodal";

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
        SpiceUrlsPanel,
        SpiceUrlsPanelHeader,
        SpiceUrlItem,
        SpiceUrlsList,
        SpiceUrlsEditModal
    ]
})
export class ModuleSpiceUrls {

}

/**
 * @module ModuleSpiceMap
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

// import interfaces
import /*embed*/ {mapOptionsI,RecordI,DirectionResultI,RoutePointI} from './interfaces/spicemap.interfaces';

import /*embed*/ {SpiceMap} from './components/spicemap';
import /*embed*/ {SpiceGoogleMapsList} from './components/spicegooglemapslist';
import /*embed*/ {SpiceGoogleMapsRecord} from './components/spicegooglemapsrecord';
import /*embed*/ {SpiceMapSelector} from './components/spicemapselector';
import /*embed*/ {SpiceGoogleMaps} from './components/spicegooglemaps';
import /*embed*/ {SpiceMapGeoDataField} from './actions/spicemapgeodatafield';

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
        SpiceMap,
        SpiceGoogleMapsList,
        SpiceGoogleMapsRecord,
        SpiceGoogleMaps,
        SpiceMapSelector,
        SpiceMapGeoDataField
    ],
    exports: [
        SpiceGoogleMaps,
        SpiceMapGeoDataField
    ]
})
export class ModuleSpiceMap {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}

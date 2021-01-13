/**
 * @module ModuleSpiceMap
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

// import interfaces
import /*embed*/ {MapCenterI,MapFixedCircleI,MapCircleI,RecordComponentConfigI,MapOptionsI,RecordI,DirectionResultI,RoutePointI} from './interfaces/spicemap.interfaces';

import /*embed*/ {SpiceMap} from './components/spicemap';
import /*embed*/ {SpiceGoogleMapsListHeader} from './components/spicegooglemapslistheader';
import /*embed*/ {SpiceGoogleMapsList} from './components/spicegooglemapslist';
import /*embed*/ {SpiceGoogleMapsRecordContainer} from './components/spicegooglemapsrecordcontainer';
import /*embed*/ {SpiceGoogleMapsRecord} from './components/spicegooglemapsrecord';
import /*embed*/ {SpiceMapSelector} from './components/spicemapselector';
import /*embed*/ {SpiceGoogleMaps} from './components/spicegooglemaps';
import /*embed*/ {SpiceMapGeoDataField} from './fields/spicemapgeodatafield';
import /*embed*/ {SpiceGoogleMapsDirectionModal} from './components/spicegooglemapsdirectionmodal';

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
        SpiceGoogleMapsListHeader,
        SpiceGoogleMapsList,
        SpiceGoogleMapsRecordContainer,
        SpiceGoogleMapsRecord,
        SpiceGoogleMaps,
        SpiceMapSelector,
        SpiceMapGeoDataField,
        SpiceGoogleMapsDirectionModal
    ],
    exports: [
        SpiceGoogleMaps,
        SpiceMapGeoDataField,
        SpiceGoogleMapsRecord
    ]
})
export class ModuleSpiceMap {
}

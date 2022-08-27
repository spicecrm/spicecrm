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
import {MapCenterI,MapFixedCircleI,MapCircleI,RecordComponentConfigI,MapOptionsI,RecordI,DirectionResultI,RoutePointI} from './interfaces/spicemap.interfaces';

import {SpiceMap} from './components/spicemap';
import {SpiceGoogleMapsListHeader} from './components/spicegooglemapslistheader';
import {SpiceGoogleMapsList} from './components/spicegooglemapslist';
import {SpiceGoogleMapsRecordContainer} from './components/spicegooglemapsrecordcontainer';
import {SpiceGoogleMapsRecord} from './components/spicegooglemapsrecord';
import {SpiceMapSelector} from './components/spicemapselector';
import {SpiceGoogleMaps} from './components/spicegooglemaps';
import {SpiceMapGeoDataField} from './fields/spicemapgeodatafield';
import {SpiceGoogleMapsDirectionModal} from './components/spicegooglemapsdirectionmodal';

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

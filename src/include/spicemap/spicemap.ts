/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

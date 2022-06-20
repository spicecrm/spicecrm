/**
 * @module ModuleOrgunits
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from '../../directives/directives';

import {OrgunitsChartView} from "./components/orgunitschartview";
import {OrgunitsChartViewBox} from "./components/orgunitschartviewbox";
import {OrgunitsChartConnector} from "./components/orgunitschartconnector";
import {OrgunitsChartOrgViewOrgunit} from "./components/orgunitschartvieworgunit";
import {OrgunitsChartViewBoxAdd} from "./components/orgunitschartviewboxadd";
import {OrgunitsChartViewBoxAddOptions} from "./components/orgunitschartviewboxaddoptions";

/**
 * a module to render org units and allow the chart view on an org structure
 */
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
        OrgunitsChartView,
        OrgunitsChartOrgViewOrgunit,
        OrgunitsChartViewBox,
        OrgunitsChartViewBoxAdd,
        OrgunitsChartViewBoxAddOptions,
        OrgunitsChartConnector
    ]
})
export class ModuleOrgunits {

}

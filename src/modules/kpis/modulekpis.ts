/**
 * @module ModuleKPIs
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from '../../directives/directives';
import {KPIsDashlet} from "./components/kpisdashlet";
import {KpiTile} from "./components/kpitile";
import {KPIStatistics} from "./components/kpistatistics";

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
        KPIsDashlet,
        KpiTile,
        KPIStatistics
    ],
})
export class ModuleKPIs {}

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
import {KPIHistoryModal} from "./components/kpihistorymodal";
import {KPIHistory} from "./components/kpihistory";
import {KPIsContainer} from "./components/kpiscontainer";
import {KpiTileGauge} from "./components/kpitilegauge";
import {KPIsRelatedContainer} from "./components/kpisrelatedcontainer";

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
        KPIsContainer,
        KpiTile,
        KpiTileGauge,
        KPIStatistics,
        KPIHistoryModal,
        KPIHistory,
        KPIsRelatedContainer
    ],
})
export class ModuleKPIs {}

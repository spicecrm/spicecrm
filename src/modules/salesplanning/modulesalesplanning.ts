/**
 * @module ModuleSalesPlanning
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";


import /*embed*/ {SalesPlanningService} from './services/salesplanning.service';
import /*embed*/ {SalesPlanningToolContentNoteModal} from './components/salesplanningtoolcontentnotemodal';
import /*embed*/ {SalesPlanningToolContent} from './components/salesplanningtoolcontent';
import /*embed*/ {SalesPlanningToolTree} from './components/salesplanningtooltree';
import /*embed*/ {SalesPlanningTool} from './components/salesplanningtool';
import /*embed*/ {SalesPlanningToolInputHelperModal} from './components/salesplanningtoolinputhelpermodal';
import /*embed*/ {SalesPlanningReporterIntegrationExportButton} from './components/salesplanningreporterintegrationexportbutton';
import /*embed*/ {SalesPlanningReporterIntegrationExportModal} from './components/salesplanningreporterintegrationexportmodal';

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
        SalesPlanningToolContentNoteModal,
        SalesPlanningToolContent,
        SalesPlanningToolTree,
        SalesPlanningTool,
        SalesPlanningToolInputHelperModal,
        SalesPlanningReporterIntegrationExportButton,
        SalesPlanningReporterIntegrationExportModal
    ],
    providers: [SalesPlanningService]
})
export class ModuleSalesPlanning {}

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


import {SalesPlanningService} from './services/salesplanning.service';
import {SalesPlanningToolContentNoteModal} from './components/salesplanningtoolcontentnotemodal';
import {SalesPlanningToolContent} from './components/salesplanningtoolcontent';
import {SalesPlanningToolTree} from './components/salesplanningtooltree';
import {SalesPlanningTool} from './components/salesplanningtool';
import {SalesPlanningToolInputHelperModal} from './components/salesplanningtoolinputhelpermodal';
import {SalesPlanningReporterIntegrationExportButton} from './components/salesplanningreporterintegrationexportbutton';
import {SalesPlanningReporterIntegrationExportModal} from './components/salesplanningreporterintegrationexportmodal';

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

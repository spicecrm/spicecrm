/**
 * @module ModuleSalesPlanning
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {SalesPlanningToolContentNoteModal} from './components/salesplanningtoolcontentnotemodal';
import /*embed*/ {SalesPlanningToolContent} from './components/salesplanningtoolcontent';
import /*embed*/ {SalesPlanningToolTree} from './components/salesplanningtooltree';
import /*embed*/ {SalesPlanningTool} from './components/salesplanningtool';
import /*embed*/ {SalesPlanningService} from './services/salesplanning.service';
import {DirectivesModule} from "../../directives/directives";

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
    ],
    providers: [SalesPlanningService]
})
export class ModuleSalesPlanning {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(private vms: VersionManagerService,) {
        this.vms.registerModule(this);
    }
}

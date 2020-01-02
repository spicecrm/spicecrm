/**
 * @module ModuleReportsDesigner
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ObjectFields} from '../../objectfields/objectfields';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ModuleReports} from "../reports/modulereports";

import /*embed*/ {ReportsDesignerService} from './services/reportsdesigner.service';

import /*embed*/ {ReportsDesigner} from "./components/reportsdesigner";
import /*embed*/ {ReportsDesignerTree} from "./components/reportsdesignertree";
import /*embed*/ {ReportsDesignerDetails} from "./components/reportsdesignerdetails";
import /*embed*/ {ReportsDesignerManipulate} from "./components/reportsdesignermanipulate";
import /*embed*/ {ReportsDesignerManipulateTableRow} from "./components/reportsdesignermanipulatetablerow";
import /*embed*/ {ReportsDesignerManipulateTableRowExpansion} from "./components/reportsdesignermanipulatetablerowexpansion";
import /*embed*/ {ReportsDesignerPresent} from "./components/reportsdesignerpresent";
import /*embed*/ {ReportsDesignerVisualize} from "./components/reportsdesignervisualize";
import /*embed*/ {ReportsDesignerIntegrate} from "./components/reportsdesignerintegrate";
import /*embed*/ {ReportsDesignerFilter} from "./components/reportsdesignerfilter";
import /*embed*/ {ReportsDesignerConditionGroup} from "./components/reportsdesignerconditiongroup";
import /*embed*/ {ReportsDesignerConditionGroupExpansion} from "./components/reportsdesignerconditiongroupexpansion";
import /*embed*/ {ReportsDesignerCondition} from "./components/reportsdesignercondition";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule,
        ModuleReports
    ],
    declarations: [
        ReportsDesigner,
        ReportsDesignerTree,
        ReportsDesignerDetails,
        ReportsDesignerManipulate,
        ReportsDesignerPresent,
        ReportsDesignerVisualize,
        ReportsDesignerIntegrate,
        ReportsDesignerFilter,
        ReportsDesignerConditionGroup,
        ReportsDesignerConditionGroupExpansion,
        ReportsDesignerCondition,
        ReportsDesignerManipulateTableRow,
        ReportsDesignerManipulateTableRowExpansion
    ],
    exports: [
        ReportsDesigner
    ],
    providers: [
        ReportsDesignerService
    ]
})
export class ModuleReportsDesigner {
}

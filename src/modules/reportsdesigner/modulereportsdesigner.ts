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
import /*embed*/ {ReportsDesignerManipulateUnion} from "./components/reportsdesignermanipulateunion";
import /*embed*/ {ReportsDesignerManipulateTableRow} from "./components/reportsdesignermanipulatetablerow";
import /*embed*/ {ReportsDesignerManipulateUnionTableRow} from "./components/reportsdesignermanipulateuniontablerow";
import /*embed*/ {ReportsDesignerManipulateTableRowExpansion} from "./components/reportsdesignermanipulatetablerowexpansion";
import /*embed*/ {ReportsDesignerPresent} from "./components/reportsdesignerpresent";
import /*embed*/ {ReportsDesignerPresentItem} from "./components/reportsdesignerpresentitem";
import /*embed*/ {ReportsDesignerPresentItemTable} from "./components/reportsdesignerpresentitemtable";
import /*embed*/ {ReportsDesignerPresentItemStandard} from "./components/reportsdesignerpresentitemstandard";
import /*embed*/ {ReportsDesignerPresentItemStandardWithSummary} from "./components/reportsdesignerpresentitemstandardwithsummary";
import /*embed*/ {ReportsDesignerPresentItemStandardWithPreview} from "./components/reportsdesignerpresentitemstandardwithpreview";
import /*embed*/ {ReportsDesignerPresentItemTreeView} from "./components/reportsdesignerpresentitemtreeview";
import /*embed*/ {ReportsDesignerPresentItemGrouped} from "./components/reportsdesignerpresentitemgrouped";
import /*embed*/ {ReportsDesignerPresentItemPivot} from "./components/reportsdesignerpresentitempivot";
import /*embed*/ {ReportsDesignerVisualize} from "./components/reportsdesignervisualize";
import /*embed*/ {ReportsDesignerIntegrate} from "./components/reportsdesignerintegrate";
import /*embed*/ {ReportsDesignerIntegrateItem} from "./components/reportsdesignerintegrateitem";
import /*embed*/ {ReportsDesignerIntegrateItemTargetList} from "./components/reportsdesignerintegrateitemtargetlist";
import /*embed*/ {ReportsDesignerIntegrateItemPublish} from "./components/reportsdesignerintegrateitempublish";
import /*embed*/ {ReportsDesignerIntegrateItemSchedule} from "./components/reportsdesignerintegrateitemschedule";
import /*embed*/ {ReportsDesignerIntegrateItemDrilldown} from "./components/reportsdesignerintegrateitemdrilldown";
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
        ReportsDesignerManipulateUnion,
        ReportsDesignerPresent,
        ReportsDesignerPresentItem,
        ReportsDesignerPresentItemTable,
        ReportsDesignerPresentItemStandard,
        ReportsDesignerPresentItemStandardWithSummary,
        ReportsDesignerPresentItemStandardWithPreview,
        ReportsDesignerPresentItemTreeView,
        ReportsDesignerPresentItemGrouped,
        ReportsDesignerPresentItemPivot,
        ReportsDesignerVisualize,
        ReportsDesignerIntegrate,
        ReportsDesignerIntegrateItem,
        ReportsDesignerIntegrateItemTargetList,
        ReportsDesignerIntegrateItemPublish,
        ReportsDesignerIntegrateItemSchedule,
        ReportsDesignerIntegrateItemDrilldown,
        ReportsDesignerFilter,
        ReportsDesignerConditionGroup,
        ReportsDesignerConditionGroupExpansion,
        ReportsDesignerCondition,
        ReportsDesignerManipulateTableRow,
        ReportsDesignerManipulateUnionTableRow,
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

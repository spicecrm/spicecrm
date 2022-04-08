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
import {ModuleReports} from "../../modules/reports/modulereports";

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
import /*embed*/ {ReportsDesignerVisualize} from "./components/reportsdesignervisualize";
import /*embed*/ {ReportsDesignerVisualizeItem} from "./components/reportsdesignervisualizeitem";
import /*embed*/ {ReportsDesignerVisualizeItemChartTypePanel} from "./components/reportsdesignervisualizeitemcharttypepanel";
import /*embed*/ {ReportsDesignerVisualizeItemChartDataPanel} from "./components/reportsdesignervisualizeitemchartdatapanel";
import /*embed*/ {ReportsDesignerVisualizeItemChartDataPanelSingleSeries} from "./components/reportsdesignervisualizeitemchartdatapanelsingleseries";
import /*embed*/ {ReportsDesignerVisualizeItemChartDataPanelMultipleSeries} from "./components/reportsdesignervisualizeitemchartdatapanelmultipleseries";
import /*embed*/ {ReportsDesignerVisualizeItemGoogleCharts} from "./components/reportsdesignervisualizeitemgooglecharts";
import /*embed*/ {ReportsDesignerIntegrate} from "./components/reportsdesignerintegrate";
import /*embed*/ {ReportsDesignerIntegrateItem} from "./components/reportsdesignerintegrateitem";
import /*embed*/ {ReportsDesignerIntegrateItemTargetList} from "./components/reportsdesignerintegrateitemtargetlist";
import /*embed*/ {ReportsDesignerFilter} from "./components/reportsdesignerfilter";
import /*embed*/ {ReportsDesignerConditionGroup} from "./components/reportsdesignerconditiongroup";
import /*embed*/ {ReportsDesignerConditionGroupExpansion} from "./components/reportsdesignerconditiongroupexpansion";
import /*embed*/ {ReportsDesignerCondition} from "./components/reportsdesignercondition";
import /*embed*/ {ReportsDesignerSelectModuleModal} from "./components/reportsdesignerselectmodulemodal";

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
        ReportsDesignerVisualize,
        ReportsDesignerVisualizeItem,
        ReportsDesignerVisualizeItemChartTypePanel,
        ReportsDesignerVisualizeItemChartDataPanel,
        ReportsDesignerVisualizeItemChartDataPanelSingleSeries,
        ReportsDesignerVisualizeItemChartDataPanelMultipleSeries,
        ReportsDesignerVisualizeItemGoogleCharts,
        ReportsDesignerIntegrate,
        ReportsDesignerIntegrateItem,
        ReportsDesignerIntegrateItemTargetList,
        ReportsDesignerFilter,
        ReportsDesignerConditionGroup,
        ReportsDesignerConditionGroupExpansion,
        ReportsDesignerCondition,
        ReportsDesignerManipulateTableRow,
        ReportsDesignerManipulateUnionTableRow,
        ReportsDesignerManipulateTableRowExpansion,
        ReportsDesignerSelectModuleModal
    ],
    exports: [
        ReportsDesigner,
        ReportsDesignerPresentItemTable,
        ReportsDesignerVisualizeItemChartTypePanel,
        ReportsDesignerVisualizeItemChartDataPanel
    ],
    providers: [
        ReportsDesignerService
    ]
})
export class ModuleReportsDesigner {
}

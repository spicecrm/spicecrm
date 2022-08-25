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

import {ReportsDesignerService} from './services/reportsdesigner.service';

import {ReportsDesigner} from "./components/reportsdesigner";
import {ReportsDesignerTree} from "./components/reportsdesignertree";
import {ReportsDesignerDetails} from "./components/reportsdesignerdetails";
import {ReportsDesignerManipulate} from "./components/reportsdesignermanipulate";
import {ReportsDesignerManipulateUnion} from "./components/reportsdesignermanipulateunion";
import {ReportsDesignerManipulateTableRow} from "./components/reportsdesignermanipulatetablerow";
import {ReportsDesignerManipulateUnionTableRow} from "./components/reportsdesignermanipulateuniontablerow";
import {ReportsDesignerManipulateTableRowExpansion} from "./components/reportsdesignermanipulatetablerowexpansion";
import {ReportsDesignerPresent} from "./components/reportsdesignerpresent";
import {ReportsDesignerPresentItem} from "./components/reportsdesignerpresentitem";
import {ReportsDesignerPresentItemTable} from "./components/reportsdesignerpresentitemtable";
import {ReportsDesignerPresentItemStandard} from "./components/reportsdesignerpresentitemstandard";
import {ReportsDesignerVisualize} from "./components/reportsdesignervisualize";
import {ReportsDesignerVisualizeItem} from "./components/reportsdesignervisualizeitem";
import {ReportsDesignerVisualizeItemChartTypePanel} from "./components/reportsdesignervisualizeitemcharttypepanel";
import {ReportsDesignerVisualizeItemChartDataPanel} from "./components/reportsdesignervisualizeitemchartdatapanel";
import {ReportsDesignerVisualizeItemChartDataPanelSingleSeries} from "./components/reportsdesignervisualizeitemchartdatapanelsingleseries";
import {ReportsDesignerVisualizeItemChartDataPanelMultipleSeries} from "./components/reportsdesignervisualizeitemchartdatapanelmultipleseries";
import {ReportsDesignerVisualizeItemGoogleCharts} from "./components/reportsdesignervisualizeitemgooglecharts";
import {ReportsDesignerIntegrate} from "./components/reportsdesignerintegrate";
import {ReportsDesignerIntegrateItem} from "./components/reportsdesignerintegrateitem";
import {ReportsDesignerIntegrateItemTargetList} from "./components/reportsdesignerintegrateitemtargetlist";
import {ReportsDesignerFilter} from "./components/reportsdesignerfilter";
import {ReportsDesignerConditionGroup} from "./components/reportsdesignerconditiongroup";
import {ReportsDesignerConditionGroupExpansion} from "./components/reportsdesignerconditiongroupexpansion";
import {ReportsDesignerCondition} from "./components/reportsdesignercondition";
import {ReportsDesignerSelectModuleModal} from "./components/reportsdesignerselectmodulemodal";

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

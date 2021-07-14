/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

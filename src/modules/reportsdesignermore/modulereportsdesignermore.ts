/**
 * @module ModuleReportsDesignerMore
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ObjectFields} from '../../objectfields/objectfields';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {ModuleReportsDesigner} from "../../modules/reportsdesigner/modulereportsdesigner";

import /*embed*/ {ReportsDesignerMorePresentItemStandardWithSummary} from "./components/reportsdesignermorepresentitemstandardwithsummary";
import /*embed*/ {ReportsDesignerMorePresentItemStandardWithPreview} from "./components/reportsdesignermorepresentitemstandardwithpreview";
import /*embed*/ {ReportsDesignerMorePresentItemTreeView} from "./components/reportsdesignermorepresentitemtreeview";
import /*embed*/ {ReportsDesignerMorePresentItemGrouped} from "./components/reportsdesignermorepresentitemgrouped";
import /*embed*/ {ReportsDesignerMorePresentItemPivot} from "./components/reportsdesignermorepresentitempivot";
import /*embed*/ {ReportsDesignerMoreVisualizeItemGoogleMaps} from "./components/reportsdesignermorevisualizeitemgooglemaps";
import /*embed*/ {ReportsDesignerMoreVisualizeItemHighCharts} from "./components/reportsdesignermorevisualizeitemhighcharts";
import /*embed*/ {ReportsDesignerMoreIntegrateItemPublish} from "./components/reportsdesignermoreintegrateitempublish";
import /*embed*/ {ReportsDesignerMoreIntegrateItemSchedule} from "./components/reportsdesignermoreintegrateitemschedule";
import /*embed*/ {ReportsDesignerMoreIntegrateItemDrilldown} from "./components/reportsdesignermoreintegrateitemdrilldown";
import /*embed*/ {ReportsDesignerMoreIntegrateItemFilters} from "./components/reportsdesignermoreintegrateitemfilters";
import /*embed*/ {ReportsDesignerMoreIntegrateItemSnapshots} from "./components/reportsdesignermoreintegrateitemsnapshots";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        DragDropModule,
        ModuleReportsDesigner
    ],
    declarations: [
        ReportsDesignerMorePresentItemStandardWithSummary,
        ReportsDesignerMorePresentItemStandardWithPreview,
        ReportsDesignerMorePresentItemTreeView,
        ReportsDesignerMorePresentItemGrouped,
        ReportsDesignerMorePresentItemPivot,
        ReportsDesignerMoreVisualizeItemGoogleMaps,
        ReportsDesignerMoreVisualizeItemHighCharts,
        ReportsDesignerMoreIntegrateItemPublish,
        ReportsDesignerMoreIntegrateItemSchedule,
        ReportsDesignerMoreIntegrateItemDrilldown,
        ReportsDesignerMoreIntegrateItemFilters,
        ReportsDesignerMoreIntegrateItemSnapshots,
    ]
})
export class ModuleReportsDesignerMore {
}

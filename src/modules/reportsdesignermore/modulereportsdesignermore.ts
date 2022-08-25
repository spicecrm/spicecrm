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

import {ReportsDesignerMorePresentItemStandardWithSummary} from "./components/reportsdesignermorepresentitemstandardwithsummary";
import {ReportsDesignerMorePresentItemStandardWithPreview} from "./components/reportsdesignermorepresentitemstandardwithpreview";
import {ReportsDesignerMorePresentItemTreeView} from "./components/reportsdesignermorepresentitemtreeview";
import {ReportsDesignerMorePresentItemGrouped} from "./components/reportsdesignermorepresentitemgrouped";
import {ReportsDesignerMorePresentItemPivot} from "./components/reportsdesignermorepresentitempivot";
import {ReportsDesignerMoreVisualizeItemGoogleMaps} from "./components/reportsdesignermorevisualizeitemgooglemaps";
import {ReportsDesignerMoreVisualizeItemHighCharts} from "./components/reportsdesignermorevisualizeitemhighcharts";
import {ReportsDesignerMoreIntegrateItemPublish} from "./components/reportsdesignermoreintegrateitempublish";
import {ReportsDesignerMoreIntegrateItemSchedule} from "./components/reportsdesignermoreintegrateitemschedule";
import {ReportsDesignerMoreIntegrateItemDrilldown} from "./components/reportsdesignermoreintegrateitemdrilldown";
import {ReportsDesignerMoreIntegrateItemFilters} from "./components/reportsdesignermoreintegrateitemfilters";
import {ReportsDesignerMoreIntegrateItemSnapshots} from "./components/reportsdesignermoreintegrateitemsnapshots";

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

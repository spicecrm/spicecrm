/**
 * @module ModuleReportsMore
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {ObjectFields}      from '../../objectfields/objectfields';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {ModuleReports} from "../../modules/reports/modulereports";

import {reporterconfig} from '../../modules/reports/services/reporterconfig';

import /*embed*/ {ReporterDetailPresentationStandardWS} from "./components/reporterdetailpresentationstandardws";
import /*embed*/ {ReporterDetailPresentationGrouped} from "./components/reporterdetailpresentationgrouped";
import /*embed*/ {ReporterDetailPresentationTree} from "./components/reporterdetailpresentationtree";
import /*embed*/ {ReporterDetailPresentationPivot} from "./components/reporterdetailpresentationpivot";
import /*embed*/ {ReporterDetailVisualizationHighcharts} from "./components/reporterdetailvisualizationhighcharts";
import /*embed*/ {ReporterDetailVisualizationGoogleMaps} from "./components/reporterdetailvisualizationgooglemaps";

import /*embed*/ {ReporterIntegrationXLSexportButton} from "./components/reporterintegrationxlsexportbutton";
import /*embed*/ {ReporterIntegrationPDFexportButton} from "./components/reporterintegrationpdfexportbutton";

import /*embed*/ {ReporterIntegrationQueryanalyzerButton} from "./components/reporterintegrationqueryanalyzerbutton";
import /*embed*/ {ReporterIntegrationQueryanalyzerModal} from "./components/reporterintegrationqueryanalyzermodal";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ModuleReports
    ],
    declarations: [
        ReporterDetailPresentationStandardWS,
        ReporterDetailPresentationGrouped,
        ReporterDetailPresentationTree,
        ReporterDetailPresentationPivot,
        ReporterDetailVisualizationHighcharts,
        ReporterDetailVisualizationGoogleMaps,
        ReporterIntegrationXLSexportButton,
        ReporterIntegrationPDFexportButton,
        ReporterIntegrationQueryanalyzerButton,
        ReporterIntegrationQueryanalyzerModal
    ]
})
export class ModuleReportsMore {
}

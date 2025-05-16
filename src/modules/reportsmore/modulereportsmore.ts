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

import {ReporterDetailPresentationStandardWS} from "./components/reporterdetailpresentationstandardws";
import {ReporterDetailPresentationGrouped} from "./components/reporterdetailpresentationgrouped";
import {ReporterDetailPresentationTree} from "./components/reporterdetailpresentationtree";
import {ReporterDetailPresentationPivot} from "./components/reporterdetailpresentationpivot";
import {ReporterDetailVisualizationHighcharts} from "./components/reporterdetailvisualizationhighcharts";
import {ReporterDetailVisualizationGoogleMaps} from "./components/reporterdetailvisualizationgooglemaps";

import {ReporterIntegrationXLSexportButton} from "./components/reporterintegrationxlsexportbutton";
import {ReporterIntegrationPDFexportButton} from "./components/reporterintegrationpdfexportbutton";

import {ReporterIntegrationQueryanalyzerButton} from "./components/reporterintegrationqueryanalyzerbutton";
import {ReporterIntegrationQueryanalyzerModal} from "./components/reporterintegrationqueryanalyzermodal";
import {ReporterIntegrationProcessWorkflowButton} from "./components/reporterintegrationprocessworkflowbutton";
import {ReporterIntegrationParentContainer} from "./components/reporterintegrationparentcontainer";


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
        ReporterIntegrationQueryanalyzerModal,
        ReporterIntegrationProcessWorkflowButton,
        ReporterIntegrationParentContainer
    ]
})
export class ModuleReportsMore {
}

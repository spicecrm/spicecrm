/**
 * @module ModuleReports
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {ObjectFields}      from '../../objectfields/objectfields';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ {reporterconfig} from './services/reporterconfig';

import /*embed*/ {ReporterDetailView} from "./components/reporterdetailview"
import /*embed*/ {ReporterFilterButton} from "./components/reporterfilterbutton"
import /*embed*/ {ReporterFilterPanel} from "./components/reporterfilterpanel"
import /*embed*/ {ReporterFilterSavedFilters} from "./components/reporterfiltersavedfilters"
import /*embed*/ {ReporterFilterItem} from "./components/reporterfilteritem"
import /*embed*/ {ReporterFilterItemText} from "./components/reporterfilteritemtext"
import /*embed*/ {ReporterFilterItemEnum} from "./components/reporterfilteritemenum"
import /*embed*/ {ReporterDetailPresentationStandard} from "./components/reporterdetailpresentationstandard"
import /*embed*/ {ReporterDetailVisualization} from "./components/reporterdetailvisualization"
import /*embed*/ {ReporterDetailVisualizationHighcharts} from "./components/reporterdetailvisualizationhighcharts"
import /*embed*/ {ReporterDetailVisualizationGooglecharts} from "./components/reporterdetailvisualizationgooglecharts"
import /*embed*/ {ReporterVisualizationDashlet} from "./components/reportervisualizationdashlet"
import /*embed*/ {ReporterVisualizationContainer} from "./components/reportervisualizationcontainer"
import /*embed*/ {ReporterPresentationDashlet} from "./components/reporterpresentationdashlet"
import /*embed*/ {ReporterCockpit} from "./components/reportercockpit"
import /*embed*/ {ReporterCockpitTile} from "./components/reportercockpittile"
import /*embed*/ {ReporterFieldContainer} from "./components/reporterfieldcontainer"
import /*embed*/ {ReporterFieldStandard} from "./components/reporterfieldstandard"
import /*embed*/ {ReporterFieldCurrency} from "./components/reporterfieldcurrency"
import /*embed*/ {ReporterFieldEnum} from "./components/reporterfieldenum"
import /*embed*/ {ReporterFieldDate} from "./components/reporterfielddate"
import /*embed*/ {ReporterFieldColor} from "./components/reporterfieldcolor"

import /*embed*/ {ReporterIntegrationExportButton} from "./components/reporterintegrationexportbutton"
import /*embed*/ {ReporterIntegrationTargetlistexportButton} from "./components/reporterintegrationtargetlistexportbutton"
import /*embed*/ {ReporterIntegrationExportMask} from "./components/reporterintegrationexportmask"
import /*embed*/ {ReporterIntegrationTargetlistexportModal} from "./components/reporterintegrationtargetlistexportmodal"
import /*embed*/ {ReporterIntegrationCSVexportButton} from "./components/reporterintegrationcsvexportbutton"
import /*embed*/ {ReporterIntegrationXLSexportButton} from "./components/reporterintegrationxlsexportbutton"
import /*embed*/ {ReporterIntegrationPDFexportButton} from "./components/reporterintegrationpdfexportbutton"

import /*embed*/ {ReporterIntegrationToolsButton} from "./components/reporterintegrationtoolsbutton"
import /*embed*/ {ReporterIntegrationQueryanalyzerButton} from "./components/reporterintegrationqueryanalyzerbutton"
import /*embed*/ {ReporterIntegrationQueryanalyzerModal} from "./components/reporterintegrationqueryanalyzermodal"

/**
* @ignore
*/
declare var moment: any;

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        SystemComponents
    ],
    declarations: [
        ReporterDetailView,
        ReporterFilterButton,
        ReporterFilterPanel,
        ReporterFilterSavedFilters,
        ReporterFilterItem,
        ReporterFilterItemText,
        ReporterFilterItemEnum,
        ReporterDetailPresentationStandard,
        ReporterDetailVisualization,
        ReporterDetailVisualizationHighcharts,
        ReporterDetailVisualizationGooglecharts,
        ReporterVisualizationDashlet,
        ReporterVisualizationContainer,
        ReporterPresentationDashlet,
        ReporterCockpit,
        ReporterCockpitTile,
        ReporterFieldContainer,
        ReporterFieldStandard,
        ReporterFieldCurrency,
        ReporterFieldEnum,
        ReporterFieldDate,
        ReporterFieldColor,
        ReporterIntegrationExportButton,
        ReporterIntegrationExportMask,
        ReporterIntegrationTargetlistexportButton,
        ReporterIntegrationTargetlistexportModal,
        ReporterIntegrationCSVexportButton,
        ReporterIntegrationXLSexportButton,
        ReporterIntegrationPDFexportButton,
        ReporterIntegrationToolsButton,
        ReporterIntegrationQueryanalyzerButton,
        ReporterIntegrationQueryanalyzerModal
    ],
    entryComponents: [
        ReporterDetailView,
        ReporterDetailPresentationStandard,
        ReporterDetailVisualizationHighcharts,
        ReporterDetailVisualizationGooglecharts,
        ReporterVisualizationDashlet,
        ReporterPresentationDashlet,
        ReporterVisualizationContainer,
        ReporterCockpit
    ],
    exports: [
        ReporterDetailView,
        ReporterVisualizationDashlet,
        ReporterPresentationDashlet
    ]
})
export class ModuleReports {
}
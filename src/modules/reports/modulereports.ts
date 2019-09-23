/**
 * @module ModuleReports
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ObjectFields} from '../../objectfields/objectfields';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {reporterconfig} from './services/reporterconfig';

import /*embed*/ {ReporterDetailView} from "./components/reporterdetailview";
import /*embed*/ {ReporterFilterButton} from "./components/reporterfilterbutton";
import /*embed*/ {ReporterFilterPanel} from "./components/reporterfilterpanel";
import /*embed*/ {ReporterFilterSavedFilters} from "./components/reporterfiltersavedfilters";
import /*embed*/ {ReporterFilterItem} from "./components/reporterfilteritem";
import /*embed*/ {ReporterFilterItemText} from "./components/reporterfilteritemtext";
import /*embed*/ {ReporterFilterItemEnum} from "./components/reporterfilteritemenum";
import /*embed*/ {ReporterFilterItemDate} from "./components/reporterfilteritemdate";
import /*embed*/ {ReporterDetailPresentationStandard} from "./components/reporterdetailpresentationstandard";
import /*embed*/ {ReporterDetailVisualization} from "./components/reporterdetailvisualization";
import /*embed*/ {ReporterDetailVisualizationGooglecharts} from "./components/reporterdetailvisualizationgooglecharts";
import /*embed*/ {ReporterVisualizationDashlet} from "./components/reportervisualizationdashlet";
import /*embed*/ {ReporterVisualizationContainer} from "./components/reportervisualizationcontainer";
import /*embed*/ {ReporterPresentationContainer} from "./components/reporterpresentationcontainer";
import /*embed*/ {ReporterPresentationDashlet} from "./components/reporterpresentationdashlet";
import /*embed*/ {ReporterCockpit} from "./components/reportercockpit";
import /*embed*/ {ReporterCockpitTile} from "./components/reportercockpittile";
import /*embed*/ {ReporterFieldContainer} from "./components/reporterfieldcontainer";
import /*embed*/ {ReporterFieldStandard} from "./components/reporterfieldstandard";
import /*embed*/ {ReporterFieldCurrency} from "./components/reporterfieldcurrency";
import /*embed*/ {ReporterFieldEnum} from "./components/reporterfieldenum";
import /*embed*/ {ReporterFieldDate} from "./components/reporterfielddate";
import /*embed*/ {ReporterFieldColor} from "./components/reporterfieldcolor";

import /*embed*/ {ReporterIntegrationExportButton} from "./components/reporterintegrationexportbutton";
import /*embed*/ {ReporterIntegrationTargetlistexportButton} from "./components/reporterintegrationtargetlistexportbutton";
import /*embed*/ {ReporterIntegrationExportMask} from "./components/reporterintegrationexportmask";
import /*embed*/ {ReporterIntegrationTargetlistexportModal} from "./components/reporterintegrationtargetlistexportmodal";
import /*embed*/ {ReporterIntegrationCSVexportButton} from "./components/reporterintegrationcsvexportbutton";

import /*embed*/ {ReporterIntegrationToolsButton} from "./components/reporterintegrationtoolsbutton";

/**
 * @ignore
 */
declare var moment: any;

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        ReporterDetailView,
        ReporterFilterButton,
        ReporterFilterPanel,
        ReporterFilterSavedFilters,
        ReporterFilterItem,
        ReporterFilterItemText,
        ReporterFilterItemEnum,
        ReporterFilterItemDate,
        ReporterDetailPresentationStandard,
        ReporterDetailVisualization,
        ReporterDetailVisualizationGooglecharts,
        ReporterVisualizationDashlet,
        ReporterVisualizationContainer,
        ReporterPresentationContainer,
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
        ReporterIntegrationToolsButton,
    ],
    exports: [
        ReporterFieldContainer
    ]
})
export class ModuleReports {
}

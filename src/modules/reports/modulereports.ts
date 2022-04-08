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
import {DragDropModule} from '@angular/cdk/drag-drop';

import /*embed*/ {reporterconfig} from './services/reporterconfig';

import /*embed*/ {ReporterDetailView} from "./components/reporterdetailview";
import /*embed*/ {ReporterDetailViewHeader} from "./components/reporterdetailviewheader";
import /*embed*/ {ReporterFilterButton} from "./components/reporterfilterbutton";
import /*embed*/ {ReporterDetailViewRefreshButton} from "./components/reporterdetailviewrefreshbutton";
import /*embed*/ {ReporterDetailViewEditButton} from "./components/reporterdetailvieweditbutton";
import /*embed*/ {ReporterFilterPanel} from "./components/reporterfilterpanel";
import /*embed*/ {ReporterFilterSavedFilters} from "./components/reporterfiltersavedfilters";
import /*embed*/ {ReporterFilterItem} from "./components/reporterfilteritem";
import /*embed*/ {ReporterFilterItemText} from "./components/reporterfilteritemtext";
import /*embed*/ {ReporterFilterItemEnum} from "./components/reporterfilteritemenum";
import /*embed*/ {ReporterFilterItemDate} from "./components/reporterfilteritemdate";
import /*embed*/ {ReporterFilterItemUser} from "./components/reporterfilteritemuser";
import /*embed*/ {ReporterFilterItemParent} from "./components/reporterfilteritemparent";
import /*embed*/ {ReporterFilterItemReference} from "./components/reporterfilteritemreference";
import /*embed*/ {ReporterFilterItemFunction} from "./components/reporterfilteritemfunction";
import /*embed*/ {ReporterFilterItemUserSingle} from "./components/reporterfilteritemusersingle";
import /*embed*/ {ReporterFilterItemUserMultiple} from "./components/reporterfilteritemusermultiple";
import /*embed*/ {ReporterDetailPresentationStandard} from "./components/reporterdetailpresentationstandard";
import /*embed*/ {ReporterDetailSelectFieldsModal} from "./components/reporterdetailselectfieldsmodal";
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
import /*embed*/ {ReporterFieldText} from "./components/reporterfieldtext";
import /*embed*/ {ReporterFieldCurrency} from "./components/reporterfieldcurrency";
import /*embed*/ {ReporterFieldPercentage} from "./components/reporterfieldpercentage";
import /*embed*/ {ReporterFieldEnum} from "./components/reporterfieldenum";
import /*embed*/ {ReporterFieldDate} from "./components/reporterfielddate";
import /*embed*/ {ReporterFieldDateTime} from "./components/reporterfielddatetime";
import /*embed*/ {ReporterFieldColor} from "./components/reporterfieldcolor";
import /*embed*/ {FieldReportCategory} from "./fields/fieldreportcategory";

import /*embed*/ {ReporterIntegrationExportButton} from "./components/reporterintegrationexportbutton";
import /*embed*/ {ReporterIntegrationTargetlistexportButton} from "./components/reporterintegrationtargetlistexportbutton";
import /*embed*/ {ReporterIntegrationExportMask} from "./components/reporterintegrationexportmask";
import /*embed*/ {ReporterIntegrationTargetlistexportModal} from "./components/reporterintegrationtargetlistexportmodal";
import /*embed*/ {ReporterIntegrationCSVexportButton} from "./components/reporterintegrationcsvexportbutton";

import /*embed*/ {ReporterIntegrationToolsButton} from "./components/reporterintegrationtoolsbutton";
import /*embed*/ {ReporterNewButton} from "./components/reporternewbutton";

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
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
        FieldReportCategory,
        ReporterDetailView,
        ReporterDetailViewHeader,
        ReporterFilterButton,
        ReporterDetailViewRefreshButton,
        ReporterDetailViewEditButton,
        ReporterFilterPanel,
        ReporterFilterSavedFilters,
        ReporterFilterItem,
        ReporterFilterItemText,
        ReporterFilterItemEnum,
        ReporterFilterItemDate,
        ReporterFilterItemUser,
        ReporterFilterItemParent,
        ReporterFilterItemUserSingle,
        ReporterFilterItemUserMultiple,
        ReporterFilterItemReference,
        ReporterFilterItemFunction,
        ReporterDetailPresentationStandard,
        ReporterDetailSelectFieldsModal,
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
        ReporterFieldText,
        ReporterFieldCurrency,
        ReporterFieldPercentage,
        ReporterFieldEnum,
        ReporterFieldDate,
        ReporterFieldDateTime,
        ReporterFieldColor,
        ReporterIntegrationExportButton,
        ReporterIntegrationExportMask,
        ReporterIntegrationTargetlistexportButton,
        ReporterIntegrationTargetlistexportModal,
        ReporterIntegrationCSVexportButton,
        ReporterIntegrationToolsButton,
        ReporterNewButton,
    ],
    exports: [
        ReporterFieldContainer,
        ReporterFilterItemEnum,
        ReporterFilterItemText,
        ReporterFilterItemDate,
        ReporterFilterItemUser,
        ReporterFilterItemReference,
        ReporterFilterItemFunction,
        ReporterFilterItemParent
    ]
})
export class ModuleReports {
}

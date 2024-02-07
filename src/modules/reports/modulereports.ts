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

import {reporterconfig} from './services/reporterconfig';

import {ReporterDetailView} from "./components/reporterdetailview";
import {ReporterDetailViewHeader} from "./components/reporterdetailviewheader";
import {ReporterFilterButton} from "./components/reporterfilterbutton";
import {ReporterDetailViewRefreshButton} from "./components/reporterdetailviewrefreshbutton";
import {ReporterDetailViewEditButton} from "./components/reporterdetailvieweditbutton";
import {ReporterFilterPanel} from "./components/reporterfilterpanel";
import {ReporterFilterSavedFilters} from "./components/reporterfiltersavedfilters";
import {ReporterFilterItem} from "./components/reporterfilteritem";
import {ReporterFilterItemText} from "./components/reporterfilteritemtext";
import {ReporterFilterItemEnum} from "./components/reporterfilteritemenum";
import {ReporterFilterItemDate} from "./components/reporterfilteritemdate";
import {ReporterFilterItemUser} from "./components/reporterfilteritemuser";
import {ReporterFilterItemParent} from "./components/reporterfilteritemparent";
import {ReporterFilterItemReference} from "./components/reporterfilteritemreference";
import {ReporterFilterItemFunction} from "./components/reporterfilteritemfunction";
import {ReporterFilterItemUserSingle} from "./components/reporterfilteritemusersingle";
import {ReporterFilterItemUserMultiple} from "./components/reporterfilteritemusermultiple";
import {ReporterDetailPresentationStandard} from "./components/reporterdetailpresentationstandard";
import {ReporterDetailSelectFieldsModal} from "./components/reporterdetailselectfieldsmodal";
import {ReporterDetailVisualization} from "./components/reporterdetailvisualization";
import {ReporterDetailVisualizationGooglecharts} from "./components/reporterdetailvisualizationgooglecharts";
import {ReporterVisualizationDashlet} from "./components/reportervisualizationdashlet";
import {ReporterVisualizationContainer} from "./components/reportervisualizationcontainer";
import {ReporterPresentationContainer} from "./components/reporterpresentationcontainer";
import {ReporterPresentationDashlet} from "./components/reporterpresentationdashlet";
import {ReporterCockpit} from "./components/reportercockpit";
import {ReporterCockpitTile} from "./components/reportercockpittile";
import {ReporterFieldContainer} from "./components/reporterfieldcontainer";
import {ReporterFieldStandard} from "./components/reporterfieldstandard";
import {ReporterFieldText} from "./components/reporterfieldtext";
import {ReporterFieldCurrency} from "./components/reporterfieldcurrency";
import {ReporterFieldPercentage} from "./components/reporterfieldpercentage";
import {ReporterFieldEnum} from "./components/reporterfieldenum";
import {ReporterFieldDate} from "./components/reporterfielddate";
import {ReporterFieldDateTime} from "./components/reporterfielddatetime";
import {ReporterFieldColor} from "./components/reporterfieldcolor";
import {FieldReportCategory} from "./fields/fieldreportcategory";

import {ReporterIntegrationExportButton} from "./components/reporterintegrationexportbutton";
import {ReporterIntegrationTargetlistexportButton} from "./components/reporterintegrationtargetlistexportbutton";
import {ReporterIntegrationExportMask} from "./components/reporterintegrationexportmask";
import {ReporterIntegrationTargetlistexportModal} from "./components/reporterintegrationtargetlistexportmodal";
import {ReporterIntegrationCSVexportButton} from "./components/reporterintegrationcsvexportbutton";

import {ReporterIntegrationToolsButton} from "./components/reporterintegrationtoolsbutton";
import {ReporterNewButton} from "./components/reporternewbutton";
import {ReporterFieldCategoryTree} from "./components/reporterfieldcategorytree";
import {ReporterFilterItemCategory} from "./components/reporterfilteritemcategory";
import {ReporterFieldNumber} from "./components/reporterfieldnumber";
import {ReporterFieldInteger} from "./components/reporterfieldinteger";

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
        ReporterFilterItemCategory,
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
        ReporterFieldCategoryTree,
        ReporterFieldNumber,
        ReporterFieldInteger,
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
        ReporterFilterItemParent,
        ReporterFilterItemCategory
    ]
})
export class ModuleReports {
}

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

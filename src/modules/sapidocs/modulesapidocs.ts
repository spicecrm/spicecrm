/**
 * @module ModuleSAPIDOCs
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import {sapIDOCSegmentI, sapIDOCSegmentRelationI} from "./interfaces/moudesapidocs.interfaces";

import {sapIdocsManager} from "./services/sapidocsmanager.service";

import {SAPIDOCsManager} from "./components/sapidocsmanager";
import {SAPIDOCsManagerSegmentsTree} from "./components/sapidocsmanagersegmentstree";
import {SAPIDOCsManagerSegmentsTreeIdocType} from "./components/sapidocsmanagersegmentstreeidoctype";
import {SAPIDOCsManagerSegmentsTreeNode} from "./components/sapidocsmanagersegmentstreenode";
import {SAPIDOCsManagerSegmentDetails} from "./components/sapidocsmanagersegmentdetails";
import {SAPIDOCsManagerSegmentDetailsSegment} from "./components/sapidocsmanagersegmentdetailssegment";
import {SAPIDOCsManagerSegmentDetailsSegmentrelation} from "./components/sapidocsmanagersegmentdetailssegmentrelation";
import {SAPIDOCsManagerSegmentDetailsFields} from "./components/sapidocsmanagersegmentdetailsfields";
import {SAPIDOCsManagerSegmentDetailsField} from "./components/sapidocsmanagersegmentdetailsfield";
import {SAPIDOCsManagerIDOCTypeAddModal} from "./components/sapidocsmanageridoctypeaddmodal";
import {SAPIDOCsManagerSegmentAddModal} from "./components/sapidocsmanagersegmentaddmodal";
import {SAPIDOCsManagerFieldAddModal} from "./components/sapidocsmanagerfieldaddmodal";
import {SAPIDOCsMonitor} from "./components/sapidocsmonitor";
import {SAPIDOCsViewer} from "./components/sapidocsviewer";
import {SAPIDOCsViewerButton} from "./components/sapidocsviewerbutton";
import {SAPIDOCsListHeaderActionsProcessButton} from "./components/sapidocslistheaderactionsprocessbutton";
import {SAPIDOCsListHeaderActionsProcessModal} from "./components/sapidocslistheaderactionsprocessmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        SAPIDOCsManager,
        SAPIDOCsManagerSegmentsTree,
        SAPIDOCsManagerSegmentsTreeIdocType,
        SAPIDOCsManagerSegmentsTreeNode,
        SAPIDOCsManagerSegmentDetails,
        SAPIDOCsManagerSegmentDetailsSegment,
        SAPIDOCsManagerSegmentDetailsSegmentrelation,
        SAPIDOCsManagerSegmentDetailsFields,
        SAPIDOCsManagerSegmentDetailsField,
        SAPIDOCsManagerIDOCTypeAddModal,
        SAPIDOCsManagerSegmentAddModal,
        SAPIDOCsManagerFieldAddModal,
        SAPIDOCsMonitor,
        SAPIDOCsViewerButton,
        SAPIDOCsViewer,
        SAPIDOCsListHeaderActionsProcessButton,
        SAPIDOCsListHeaderActionsProcessModal
    ],
})
export class ModuleSAPIDOCs {}

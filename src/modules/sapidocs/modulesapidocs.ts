/**
 * @module ModuleScrum
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {sapIdocsManager} from "./services/sapidocsmanager.service";

import /*embed*/ {SAPIDOCsManager} from "./components/sapidocsmanager";
import /*embed*/ {SAPIDOCsManagerSegmentsTree} from "./components/sapidocsmanagersegmentstree";
import /*embed*/ {SAPIDOCsManagerSegmentsTreeIdocType} from "./components/sapidocsmanagersegmentstreeidoctype";
import /*embed*/ {SAPIDOCsManagerSegmentsTreeNode} from "./components/sapidocsmanagersegmentstreenode";
import /*embed*/ {SAPIDOCsManagerSegmentDetails} from "./components/sapidocsmanagersegmentdetails";
import /*embed*/ {SAPIDOCsManagerSegmentDetailsFields} from "./components/sapidocsmanagersegmentdetailsfields";
import /*embed*/ {SAPIDOCsMonitor} from "./components/sapidocsmonitor";

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
        SAPIDOCsManagerSegmentDetailsFields,
        SAPIDOCsMonitor
    ],
})
export class ModuleSAPIOCs {}

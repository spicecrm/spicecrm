/**
 * @module ModuleCampaigns
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from "@angular/forms";

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import {CampaignTaskActivateButton} from "./components/campaigntaskactivatebutton";

import {CampaignSendMailButton} from './components/campaignsendmailbutton';
import {CampaignSendTestMailButton} from './components/campaignsendtestmailbutton';
import {CampaignExportButton} from './components/campaignexportbutton';
import {CampaignExportModal} from './components/campaignexportmodal';
import {CampaignTaskEmailPanel} from './components/campaigntaskemailpanel';
import {CampaignTaskAddModal} from "./components/campaigntaskaddmodal";
import {CampaignTaskAddButton} from "./components/campaigntaskaddbutton";
import {CampaignTaskMailMergePanel} from "./components/campaigntaskmailmergepanel";
import {CampaignTaskMailergeButton} from "./components/campaigntaskmailmergebutton";
import {CampaignTaskMailMergeModal} from "./components/campaigntaskmailmergemodal";
import {DirectivesModule} from "../../directives/directives";
import {CampaignTaskTargetsManager} from "./components/campaigntasktargetsmanager";
import {CampaignTaskTargetsManagerButton} from "./components/campaigntasktargetsmanagerbutton";
import {CampaignTaskTargetsManagerDetails} from "./components/campaigntasktargetsmanagerdetail";
import {CampaignDeactivateButton} from "./components/campaigndeactivatebutton";
import {CampaignDeleteButton} from "./components/campaigndeletebutton";

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
        CampaignTaskActivateButton,
        CampaignSendMailButton,
        CampaignSendTestMailButton,
        CampaignExportButton,
        CampaignExportModal,
        CampaignTaskEmailPanel,
        CampaignTaskAddButton,
        CampaignTaskAddModal,
        CampaignTaskMailMergePanel,
        CampaignTaskMailergeButton,
        CampaignTaskMailMergeModal,
        CampaignTaskTargetsManager,
        CampaignTaskTargetsManagerDetails,
        CampaignTaskTargetsManagerButton,
        CampaignDeactivateButton,
        CampaignDeleteButton
    ]
})
export class ModuleCampaigns {}

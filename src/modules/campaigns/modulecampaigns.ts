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

import /*embed*/ {CampaignTaskActivateButton} from "./components/campaigntaskactivatebutton";
import /*embed*/ {CampaignTaskExportButton} from "./components/campaigntaskexportbutton";

import /*embed*/ {CampaignSendMailButton} from './components/campaignsendmailbutton';
import /*embed*/ {CampaignSendTestMailButton} from './components/campaignsendtestmailbutton';
import /*embed*/ {CampaignExportButton} from './components/campaignexportbutton';
import /*embed*/ {CampaignExportModal} from './components/campaignexportmodal';
import /*embed*/ {CampaignTaskEmailPanel} from './components/campaigntaskemailpanel';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        CampaignTaskActivateButton,
        CampaignTaskExportButton,
        CampaignSendMailButton,
        CampaignSendTestMailButton,
        CampaignExportButton,
        CampaignExportModal,
        CampaignTaskEmailPanel
    ]
})
export class ModuleCampaigns {}

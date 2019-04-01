/**
 * @module ModuleCampaigns
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ {CampaignTaskActivateButton} from "./components/campaigntaskactivatebutton";

import /*embed*/ {CampaignSendMailButton} from './components/campaignsendmailbutton';
import /*embed*/ {CampaignSendTestMailButton} from './components/campaignsendtestmailbutton';


@NgModule({
    imports: [
        CommonModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        CampaignTaskActivateButton,
        CampaignSendMailButton,
        CampaignSendTestMailButton
    ]
})
export class ModuleCampaigns {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
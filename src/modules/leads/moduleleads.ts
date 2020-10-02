/**
 * @module ModuleLeads
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from '../../directives/directives';

import /*embed*/ {LeadConvertButton} from './components/leadconvertbutton';
import /*embed*/ {LeadConvertModal} from './components/leadconvertmodal';
import /*embed*/ {LeadConvert} from './components/leadconvert';
import /*embed*/ {LeadConvertContact} from './components/leadconvertcontact';
import /*embed*/ {LeadConvertItemDuplicate} from './components/leadconvertitemduplicate';
import /*embed*/ {LeadConvertAccount} from './components/leadconvertaccount';
import /*embed*/ {LeadConvertOpportunity} from './components/leadconvertopportunity';
import /*embed*/ {LeadOpenLeadsDashlet} from './components/leadopenleadsdashlet';
import /*embed*/ {LeadConvertOpportunityModal} from './components/leadconvertopportunitymodal';
import /*embed*/ {LeadNewButton} from './components/leadnewbutton';
import /*embed*/ {LeadSelectTypeModal} from './components/leadselecttypemodal';
import /*embed*/ {LeadConvertConsumerModal} from './components/leadconvertconsumermodal';

import /*embed*/ {fieldLeadClassification} from './fields/fieldleadclassification';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        LeadNewButton,
        LeadSelectTypeModal,
        LeadConvertButton,
        LeadConvertModal,
        LeadConvert,
        LeadConvertContact,
        LeadConvertAccount,
        LeadConvertItemDuplicate,
        LeadConvertOpportunity,
        LeadOpenLeadsDashlet,
        LeadConvertOpportunityModal,
        LeadConvertConsumerModal,
        fieldLeadClassification
    ],
})
export class ModuleLeads {

}

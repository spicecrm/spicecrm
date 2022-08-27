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

import {LeadConvertButton} from './components/leadconvertbutton';
import {LeadConvertModal} from './components/leadconvertmodal';
import {LeadConvert} from './components/leadconvert';
import {LeadConvertContact} from './components/leadconvertcontact';
import {LeadConvertItemDuplicate} from './components/leadconvertitemduplicate';
import {LeadConvertAccount} from './components/leadconvertaccount';
import {LeadConvertOpportunity} from './components/leadconvertopportunity';
import {LeadOpenLeadsDashlet} from './components/leadopenleadsdashlet';
import {LeadConvertOpportunityModal} from './components/leadconvertopportunitymodal';
import {LeadNewButton} from './components/leadnewbutton';
import {LeadSelectTypeModal} from './components/leadselecttypemodal';
import {LeadConvertConsumerModal} from './components/leadconvertconsumermodal';

import {fieldLeadClassification} from './fields/fieldleadclassification';

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

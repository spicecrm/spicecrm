/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

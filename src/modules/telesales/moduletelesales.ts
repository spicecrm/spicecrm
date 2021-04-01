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
 * @module ModuleTeleSales
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import /*embed*/ {telecockpitservice} from "./services/telecockpit.service";

import /*embed*/ {TeleSalesCockpitListItem} from './components/telesalescockpitlistitem';
import /*embed*/ {TeleSalesCockpitList} from './components/telesalescockpitlist';
import /*embed*/ {TeleSalesCockpitMain} from './components/telesalescockpitmain';
import /*embed*/ {TeleSalesCockpitCreateLeadButton} from './components/telesalescockpitcreateleadbutton';
import /*embed*/ {TeleSalesCockpitLogCallButton} from './components/telesalescockpitlogcallbutton';
import /*embed*/ {TeleSalesCockpitCompleteButton} from './components/telesalescockpitcompletebutton';
import /*embed*/ {TeleSalesCockpitAddAttemptButton} from './components/telesalescockpitaddattemptbutton';
import /*embed*/ {TeleSalesCockpitAddAttemptModal} from './components/telesalescockpitaddattemptmodal';
import /*embed*/ {TeleSalesCockpitModuleActions} from './components/telesalescockpitmoduleactions';
import /*embed*/ {TeleSalesCockpitAddMeetingButton} from './components/telesalescockpitaddmeetingbutton';
import /*embed*/ {TeleSalesCockpitHeader} from './components/telesalescockpitheader';
import /*embed*/ {TeleSalesCockpit} from './components/telesalescockpit';

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
        TeleSalesCockpit,
        TeleSalesCockpitHeader,
        TeleSalesCockpitList,
        TeleSalesCockpitMain,
        TeleSalesCockpitListItem,
        TeleSalesCockpitCreateLeadButton,
        TeleSalesCockpitLogCallButton,
        TeleSalesCockpitCompleteButton,
        TeleSalesCockpitAddAttemptButton,
        TeleSalesCockpitAddAttemptModal,
        TeleSalesCockpitModuleActions,
        TeleSalesCockpitAddMeetingButton,

    ],
    providers: [
        telecockpitservice
    ]
})
export class ModuleTeleSales {}

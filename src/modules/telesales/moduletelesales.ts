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
import {telecockpitservice} from "./services/telecockpit.service";

import {TeleSalesCockpitListItem} from './components/telesalescockpitlistitem';
import {TeleSalesCockpitList} from './components/telesalescockpitlist';
import {TeleSalesCockpitMain} from './components/telesalescockpitmain';
import {TeleSalesCockpitCreateLeadButton} from './components/telesalescockpitcreateleadbutton';
import {TeleSalesCockpitLogCallButton} from './components/telesalescockpitlogcallbutton';
import {TeleSalesCockpitCompleteButton} from './components/telesalescockpitcompletebutton';
import {TeleSalesCockpitAddAttemptButton} from './components/telesalescockpitaddattemptbutton';
import {TeleSalesCockpitAddAttemptModal} from './components/telesalescockpitaddattemptmodal';
import {TeleSalesCockpitModuleActions} from './components/telesalescockpitmoduleactions';
import {TeleSalesCockpitAddMeetingButton} from './components/telesalescockpitaddmeetingbutton';
import {TeleSalesCockpitHeader} from './components/telesalescockpitheader';
import {TeleSalesCockpit} from './components/telesalescockpit';

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

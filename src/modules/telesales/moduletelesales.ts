/**
 * @module ModuleTeleSales
 */
import {CommonModule} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';

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
export class ModuleTeleSales {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(private vms: VersionManagerService,) {
        this.vms.registerModule(this);
    }
}

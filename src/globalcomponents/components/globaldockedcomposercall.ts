/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {telephony} from '../../services/telephony.service';
import {telephonyCallI} from "../../services/interfaces.service";

@Component({
    selector: 'global-docked-composer-call',
    templateUrl: '../templates/globaldockedcomposercall.html'
})
export class GlobalDockedComposerCall {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true})public containercontent: ViewContainerRef;

    @Input() public calldata: telephonyCallI;

   public isClosed: boolean = false;

    constructor(public backend: backend,public dockedComposer: dockedComposer,public telephony: telephony,public language: language,public ViewContainerRef: ViewContainerRef) {

    }

    get callicon() {
        if (this.calldata.status == 'disconnected') {
            return 'end_call';
        }

        switch (this.calldata.direction) {
            case 'inbound':
                return 'incoming_call';
            case 'outbound':
                return 'outbound_call';
        }

        return 'call';
    }


    /**
     * close the composer and remove the call
     */
   public closeComposer() {
        this.telephony.removeCallById(this.calldata.id);
    }

    /**
     * end the call
     */
   public endCall() {
        this.telephony.terminateCall(this.calldata.id);
    }

    /**
     * toggles the closed state for the composer
     */
   public toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    /**
     * returns the toggle icon for the docked composer
     */
    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }

    /**
     * returns true if the call can be ended by the user
     */
    get canEndCall() {
        return this.calldata.callid && this.calldata.status != 'disconnected' && this.calldata.status != 'error';
    }
}

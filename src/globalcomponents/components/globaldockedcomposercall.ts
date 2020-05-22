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
    templateUrl: './src/globalcomponents/templates/globaldockedcomposercall.html'
})
export class GlobalDockedComposerCall implements OnInit {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    @Input() public calldata: telephonyCallI;

    private searching: boolean = true;
    private contact: any = {};
    private isClosed: boolean = false;

    constructor(private backend: backend, private dockedComposer: dockedComposer, private telephony: telephony, private language: language, private ViewContainerRef: ViewContainerRef) {

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

    public ngOnInit() {
        this.backend.postRequest('search', {}, {
            modules: 'Contacts',
            searchterm: this.calldata.msisdn
        }).subscribe(results => {
            try {
                this.contact = results.Contacts.hits[0]._source;
                this.searching = false;
            } catch (err) {
                this.searching = false;
            }
        });
    }

    /**
     * close the composer and remove the call
     */
    private closeComposer() {
        this.telephony.removeCallById(this.calldata.id);
    }

    /**
     * end the call
     */
    private endCall() {
        this.telephony.terminateCall(this.calldata.id);
    }

    /**
     * toggles the closed state for the composer
     */
    private toggleClosed() {
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

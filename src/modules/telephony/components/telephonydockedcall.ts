/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {telephony} from '../../../services/telephony.service';
import {telephonyCallI} from "../../../services/interfaces.service";
import {libloader} from "../../../services/libloader.service";
import {session} from "../../../services/session.service";

declare var moment: any;
declare var libphonenumber: any;
declare var _: any;

/**
 * serves as docked composer for the telphony interaction
 * this component also proved a modal and view for the related object that will be created as result of the call
 * loaded from the componentconfig this can e.g. be a call or a service call or whatever that can be configured role based
 */
@Component({
    templateUrl: './src/modules/telephony/templates/telephonydockedcall.html',
    providers: [model, view]
})
export class TelephonyDockedCall {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    /**
     * the data from teh call
     */
    @Input() public calldata: telephonyCallI;

    /**
     * indicates that we have loaded the phone lib
     *
     * @private
     */
    private phonelibloaded: boolean = false;

    private isClosed: boolean = false;

    /**
     * the active component that is rendered in the composer
     *
     * @private
     */
    private panelcomponent: string = 'TelephonyCallSearching';

    /**
     * a list of matched beans returned from the search service
     *
     * @private
     */
    private matchedbeans: any[] = [];

    /**
     * the component config
     *
     * @private
     */
    private componentconfig: any = {};

    constructor(private backend: backend,
                private session: session,
                private view: view,
                private model: model,
                private modal: modal,
                private toast: toast,
                private libloader: libloader,
                private telephony: telephony,
                private language: language,
                private cdref: ChangeDetectorRef,
                private ViewContainerRef: ViewContainerRef,
                private metadata: metadata) {
        this.loadPhoneLib();

        // initialize the view and set it into edit mode
        // this is required for the extended modal that is using the same injector
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * loads the phone lib
     */
    private loadPhoneLib() {
        this.libloader.loadLib('libphonenumber').subscribe(loaded => {
            this.phonelibloaded = true;
        });
    }

    /**
     * getter for the call icon dependent on the status of the call
     */
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

        // get the config
        this.componentconfig = this.metadata.getComponentConfig('TelephonyDockedCall');

        // this is the default endpoint
        let endpoint = 'search/phonenumber';

        if (this.componentconfig.searchendpoint) {
            endpoint = this.componentconfig.searchendpoint;
        }

        if (this.calldata.relatedid) {
            this.panelcomponent = 'TelephonyCallPanel';
        } else {
            this.backend.postRequest(endpoint, {}, {
                searchterm: this.calldata.msisdn
            }).subscribe(results => {
                this.matchedbeans = results;
                if (results.length == 1) {
                    this.calldata.relatedmodule = results[0].module;
                    this.calldata.relatedid = results[0].id;
                    this.calldata.relateddata = results[0].data;
                }
                this.panelcomponent = 'TelephonyCallPanel';
            });
        }
    }

    /**
     * get if the actionset in total should be disabled
     * only can be used when the relatedid is set and when the status is connected or disconnected
     */
    get actionsDisabled(){
        return !this.calldata.relatedid || (this.calldata.status != 'connected' && this.calldata.status != 'disconnected');
    }

    /**
     * listen to the handler if an attempt has been saved
     * if yes close the composer otherwise send a toast to the user
     * ToDo: Error handling?
     *
     * @param saved
     * @private
     */
    private attemptSaved(saved) {
        if (saved) {
            this.closeComposer();
        } else {
            this.toast.sendToast('Error saving Attempt', 'error');
        }
    }

    /**
     * close the composer and remove the call
     */
    private closeComposer() {
        if ((this.model.module && this.model.isDirty()) || (!this.model.module && this.calldata.note && !this.calldata.call)) {
            this.modal.prompt('confirm', this.language.getLabel('MSG_CLOSE_CALL_COMPOSER', '', 'long'), this.language.getLabel('MSG_CLOSE_CALL_COMPOSER')).subscribe(resp => {
                if (resp) {
                    this.telephony.removeCallById(this.calldata.id);
                }
            });
        } else {
            this.telephony.removeCallById(this.calldata.id);
        }
    }

    /**
     * react to the emitter of the actionset
     *
     * @param action
     * @private
     */
    private handleaction(action) {
        switch (action) {
            case 'savegodetail':
                this.model.goDetail();
                this.closeComposer();
                break;
            default:
                this.closeComposer();
        }
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
        return this.telephony.actions.hangup && this.calldata.callid && this.calldata.status != 'disconnected' && this.calldata.status != 'error';
    }

    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    get canExpand() {
        return this.model.module && !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module));
    }

    /**
     * expands the comoser and opens the GlobalDockedComposerModal window
     *
     * @private
     */
    private expand() {
        /// open the modal and set teh scope to telephony so the composer modal turns off several features like the toolbar and cannot also nto be closed
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentRef => {
            componentRef.instance.scope = 'telephony';
        });
    }

    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString && this.session.authData.address_country && this.calldata.msisdn.length > 5) {
            let msisdn = this.calldata.msisdn;
            return libphonenumber.parsePhoneNumberFromString(msisdn, this.session.authData.address_country).formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

}

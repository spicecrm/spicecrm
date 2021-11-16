/**
 * @module ModuleTelephony
 */
import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {broadcast} from "../../../services/broadcast.service";
import {session} from "../../../services/session.service";

import {telephonyCallI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";

declare var _: any;
declare var libphonenumber: any;

@Component({
    templateUrl: './src/modules/telephony/templates/telephonycallpanel.html',
})
export class TelephonyCallPanel implements OnInit, OnDestroy {

    /**
     * the component config
     *
     * @private
     */
    private compenentconfig: any = {};

    /**
     * the calldata
     */
    @Input() public calldata: telephonyCallI;

    /**
     * an array of matche records returned fromt eh phone number search
     */
    @Input() public matchedbeans: any[];

    /**
     * notes on the call
     */
    private callnotes: string = '';

    /**
     * the fieldset loaded fromt he componentconfig to be rendered for the embedded object if there is any set
     *
     * @private
     */
    private fieldset: string;

    /**
     * holds the components subscriptions
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        private metadata: metadata,
        private language: language,
        private broadcast: broadcast,
        private session: session,
        private model: model) {

    }

    public ngOnInit(): void {
        this.initalizeModel();

        // subscribe to the briadcast
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleBroadcast(message))
        );
    }

    /**
     * unsubscribe from all subscrpitions onDestroy
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle model updates from the broadcast
     *
     * @param event
     * @private
     */
    private handleBroadcast(event) {
        // check that we have a related id and that we also have the proper eventes and model in scope
        if (this.calldata.relatedid && event.messagetype == 'model.save' && event.messagedata.module == this.calldata.relatedmodule && event.messagedata.id == this.calldata.relatedid) {
            this.calldata.relateddata = event.messagedata.data;
            this.setReletadeData();
        }
    }

    /**
     * loads the component config and sets the initial data if we have a related id
     * @private
     */
    private initalizeModel() {
        this.compenentconfig = this.metadata.getComponentConfig('TelephonyCallPanel');
        if (this.compenentconfig.objectmodule) {
            // initialize the model
            this.model.module = this.compenentconfig.objectmodule;
            this.model.initialize();

            // set the related data
            this.setReletadeData();

            // specific handling for Calls where we also have a direction
            if (this.model.getField('direction')) {
                this.model.setField('direction', this.calldata.direction == 'inbound' ? 'Inbound' : 'Outbound');
            }

            // start the edit ont he model
            this.model.startEdit();
        }
        // set the fieldset
        this.fieldset = this.compenentconfig.objectfieldset;
    }

    /**
     * sets the related model data once we have a parent object
     *
     * @private
     */
    private setReletadeData() {
        if (this.calldata.relatedid) {
            // some specific handling just in case we have a call or other object that has a contacts field
            // ToDo: shoudl be solved somewhat nicer in the future, potentially with Copy Rules but woudl require a modl instance to be created
            if (this.calldata.relatedmodule == 'Contacts' && this.metadata.getModuleFields(this.model.module).contact_id) {
                this.model.setFields({
                    contact_id: this.calldata.relatedid,
                    contact_name: this.calldata.relateddata.summary_text,
                    parent_type: 'Accounts',
                    parent_id: this.calldata.relateddata.account_id,
                    parent_name: this.calldata.relateddata.account_name,
                });
            } else {
                this.model.setFields({
                    parent_type: this.calldata.relatedmodule,
                    parent_id: this.calldata.relatedid,
                    parent_name: this.calldata.relateddata.summary_text
                });
            }
        }
    }

    /**
     * gets a formatted MSISDN
     */
    get msisdnFormatted() {
        if (libphonenumber && libphonenumber.parsePhoneNumberFromString && this.session.authData.address_country && this.calldata.msisdn.length > 5) {
            return libphonenumber.parsePhoneNumberFromString(this.calldata.msisdn, this.session.authData.address_country).formatInternational();
        } else {
            return this.calldata.msisdn;
        }
    }

    /**
     * select the match
     *
     * @param record
     */
    private selectMatched(record) {
        this.calldata.relatedid = record.id;
        this.calldata.relatedmodule = record.module;
        this.calldata.relateddata = record.data;

        this.initalizeModel();
    }

    /**
     * no match found in the listed items
     */
    private noMatch() {
        this.matchedbeans = [];
    }

}

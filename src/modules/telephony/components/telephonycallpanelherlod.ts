/**
 * @module ModuleTelephony
 */
import {Component, Injector} from '@angular/core';
import {TelephonyCallPanel} from "./telephonycallpanel";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {broadcast} from "../../../services/broadcast.service";
import {session} from "../../../services/session.service";
import {backend} from "../../../services/backend.service";
import {telephonyCallI} from "../../../services/interfaces.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'telephony-call-panel-herold',
    templateUrl: '../templates/telephonycallpanelherold.html',
})
export class TelephonyCallPanelHerold {
    /**
     * holds the display value
     */
    public displayValue: string;
    /**
     * holds the herold response data
     */
    public heroldResponse: {
        city: string,
        firstname: string,
        housenumber: string,
        name: string,
        phone: string[],
        postalcode: string,
        source: string,
        street: string
    }[] = [];
    /**
     * holds the crm persons found based on the herold response data like first last name
     */
    public heroldRelatedFound: any[] = [];
    /**
     * holds the call data passed from TelephonyCallPanel
     */
    public callData: telephonyCallI;
    /**
     * holds the formatted msisdn passed from TelephonyCallPanel
     */
    public msisdnFormatted: string;

    constructor(public metadata: metadata,
                public language: language,
                public broadcast: broadcast,
                public session: session,
                public backend: backend,
                public modal: modal,
                public injector: Injector,
                private telCallPanel: TelephonyCallPanel) {

    }

    /**
     * search phone number and set display value
     */
    public ngOnInit() {
        this.displayValue = this.msisdnFormatted;
        this.heroldSearch();
    }

    /**
     * call set related data on parent component
     */
    public setRelatedData() {
        this.telCallPanel.setReletadeData();
    }

    /**
     * call unsetRelatedData on parent component
     */
    public unsetRelatedData() {
        this.telCallPanel.unsetRelatedData();
    }

    /**
     * search herold by phone number
     * @private
     */
    private heroldSearch() {

        const params = {phoneNumber: this.callData.msisdn, modules: this.metadata.getPhoneSearchModules()};

        this.backend.getRequest(`common/herold`, params).subscribe(
            (res: { foundBeans: any, herold: any[] }) => {
                this.heroldResponse = res.herold;
                Object.keys(res.foundBeans).forEach(module => {
                    this.heroldRelatedFound = this.heroldRelatedFound.concat(res.foundBeans[module].hits);
                });
                if (res.herold.length > 0) {
                    this.displayValue = `${res.herold[0].name} ${res.herold[0].firstname}`
                }
            });
    }
}

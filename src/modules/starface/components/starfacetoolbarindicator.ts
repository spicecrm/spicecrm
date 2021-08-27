/**
 * @module ModuleAsterisk
 */
import {Component, OnDestroy} from '@angular/core';

/**
 * @ignore
 */
declare var io: any;
// declare var libphonenumber: any;

import {toast} from '../../../services/toast.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";
import {session} from "../../../services/session.service";
import {socket} from "../../../services/socket.service";

import {telephonyCallI} from "../../../services/interfaces.service";

declare var moment: any;

@Component({
    templateUrl: './src/modules/starface/templates/starfacetoolbarindicator.html'
})
export class StarfaceToolbarIndicator implements OnDestroy {


    private username: string;

    /**
     * the status of the connection
     */
    private starfacestatus: 'initial' | 'connecting' | 'connected' | 'disconnected' = 'initial';


    /**
     * the socket status
     */
    private socketconnected: boolean = false;

    /**
     * holds the subscriptions
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * an interval function to keep the login alive
     */
    private keepAlive: any;

    /**
     * allows to track if we are ina  keep alive loop currently
     *
     * @private
     */
    private inKeepAlive: boolean = false;

    /**
     * indicator if the subscriptions for the events are active
     */
    private starfacesubscription: boolean = false;

    private _enabled: boolean = true;

    constructor(
        private language: language,
        private configuration: configurationService,
        private modal: modal,
        private modelutilities: modelutilities,
        private backend: backend,
        private toast: toast,
        private session: session,
        private socket: socket,
        private telephony: telephony
    ) {
        this.initialize();
    }


    public ngOnDestroy() {
        if (this.starfacestatus == 'connected') {
            this.disconnectSocket();
        }
        this.subscriptions.unsubscribe();

        // stop the keep alive ping
        if (this.keepAlive) clearInterval(this.keepAlive);

        // desctroy the socket
        this.disconnectSocket();

        this.telephony.isActive = false;
    }

    /**
     * returns a status dependet icon class
     */
    get iconClass() {
        switch (this.starfacestatus) {
            case 'connecting':
                return 'slds-icon-text-warning';
            case 'connected':
                return 'slds-icon-text-success';
            case 'disconnected':
                return 'slds-icon-text-error';
            default:
                return 'slds-icon-text-light';
        }
    }

    private toggleconnection() {
        this.enabled = !this.enabled;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;

        if (this.enabled) {
            this.login();
        } else {
            this.disconnect();
        }
    }

    /**
     * get the prefs and login
     */
    private initialize() {

        this.getPreferences().subscribe(username => {
            this.login();
        });
    }

    /**
     * get the preferences and check if we have a username set
     */
    private getPreferences(): Observable<string> {
        let retSubject = new Subject<string>();
        this.backend.getRequest('channels/voice/StarFaceVOIP/preferences').subscribe(prefs => {
            if (prefs.username) {
                this.username = prefs.username;
                retSubject.next(this.username);
            }
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    /**
     * get the preferences and check if we have a username set
     */
    private setPreferences() {
        this.modal.openModal('StarfacePreferences').subscribe(componentRef => {
            componentRef.instance.saved$.subscribe(saved => {
                this.getPreferences().subscribe(username => {
                    this.login();
                });
            });
        });
    }

    /**
     * login to the UC
     */
    private login() {
        // unsubscribe from all subscriptions
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();

        // set status to connecting
        this.starfacestatus = "connecting";
        this.backend.postRequest('channels/voice/StarFaceVOIP/login').subscribe(res => {
            if (res.login) {
                this.starfacestatus = "connected";
                this.telephony.isActive = true;

                // subscribe to the termination of the call
                this.subscriptions.add(
                    this.telephony.initiateCall$.subscribe(calldata => {
                        this.initiateCall(calldata.msisdn, calldata.relatedmodule, calldata.relatedid, calldata.relateddata);
                    })
                );

                // subscribe to the termination of the call
                this.subscriptions.add(
                    this.telephony.terminateCall$.subscribe((call: telephonyCallI) => {
                        this.terminateCall(call);
                    })
                );

                this.keepAlive = setInterval(() => {
                    this.keepalive();
                }, 45000);

                // set the subscription status
                this.starfacesubscription = res.subscription;

                // if we have a subscription also connect to the socket
                if (this.starfacesubscription) {
                    this.connectSocket();
                }
            }
        });
    }

    /**
     * disconnects
     */
    private disconnect() {
        this.starfacestatus = 'disconnected';
        this.starfacesubscription = false;
        if (this.keepAlive) {
            clearInterval(this.keepAlive);
            this.keepAlive = undefined;
        }
        this.disconnectSocket();
        this.telephony.isActive = false;
        this.subscriptions.unsubscribe();
    }

    /**
     * starface needs a timed ping to keep the session
     *
     * @private
     */
    private keepalive() {
        if(this.inKeepAlive) return;

        this.inKeepAlive = true;
        this.backend.postRequest('channels/voice/StarFaceVOIP/keepalive').subscribe(
            res => {
                if (res.status != 'success') {
                    this.starfacestatus = 'disconnected';
                    clearInterval(this.keepAlive);
                    this.login();
                }

                // reset the inidicator
                this.inKeepAlive = false;
            },
            error => {
                // reset the inidicator
                this.inKeepAlive = false;

                // disconnect
                this.disconnect();

                // trigger login
                this.login();
            });
    }

    /**
     * connect to the socket
     */
    private connectSocket() {

        this.subscriptions.add(
            this.socket.initializeNamespace('starface').subscribe(event => {
                this.handleCallEvent(event.data);
            })
        );

        // join the room
        // ToDo: ensure that the joining the room is authorized
        this.socket.joinRoom('starface', `starface::${this.username}`);

        // set to socket connected
        this.socketconnected = true;

    }

    /**
     * disconnect from the socket
     */
    private disconnectSocket() {
        if (this.socket) {
            this.socket.leaveRoom('starface', `starface::${this.username}`);
            this.socketconnected = false;
        }
    }

    /**
     * handle the event from the socket
     *
     * @param eventData
     */
    private handleCallEvent(eventData: any) {
        let call = this.telephony.calls.find(c => c.callid == eventData.id);
        if (call) {
            call.status = this.translateStatus(eventData.state);

            // in case we get to connetced set start
            if (eventData.state == 'CONNECTED' && !call.start) {
                call.start = moment();
            }

            // in case we get a hangup log the end date
            if (eventData.state == 'HANGUP' && !call.end) {
                call.end = moment();
            }

        } else {
            this.addCall(eventData);
        }
    }

    /**
     * adds the call to the telephony service
     *
     * @param eventData
     */
    private addCall(eventData) {
        /*
        let util = libphonenumber.PhoneNumberUtil.getInstance();
        let msisdn = eventData.direction == 'inbound' ? eventData.callernumber : eventData.callednumber;
        let number = util.parseAndKeepRawInput(msisdn);
         */
        this.telephony.calls.push({
            id: this.modelutilities.generateGuid(),
            callid: eventData.id,
            status: this.translateStatus(eventData.state),
            msisdn: eventData.direction == 'inbound' ? eventData.callernumber : eventData.callednumber,
            direction: eventData.direction
        });
    }

    private translateStatus(status) {
        switch (status) {
            case 'PROCEEDING':
                return 'initial';
            case 'RINGBACK':
                return 'connecting';
            case 'INCOMING':
                return 'connecting';
            case 'RINGING':
                return 'ringing';
            case 'CONNECTED':
                return 'connected';
            case 'HANGUP':
                return 'disconnected';
        }
    }

    /**
     * iniitate a call
     *
     * @param msisdn
     * @param relatedmodule
     * @param relatedrecord
     */
    private initiateCall(msisdn: string, relatedmodule?: string, relatedid?: string, relateddata?: any) {

        // create a call and push to the telphony service
        let callid = this.modelutilities.generateGuid();
        let call: telephonyCallI = {
            id: callid,
            status: 'initial',
            callid: undefined,
            msisdn: msisdn,
            direction: 'outbound',
            relatedid: relatedid,
            relatedmodule: relatedmodule,
            relateddata: relateddata
        };
        this.telephony.calls.push(call);

        // initiate the call on teh PBX
        this.backend.postRequest('channels/voice/StarFaceVOIP/call', {}, {msisdn: msisdn}).subscribe(call => {
            if (call.status != 'success') {
                this.toast.sendToast('error placing call', 'error');
                this.telephony.removeCallById(callid);
            } else {
                let tcall = this.telephony.calls.find(c => c.id == callid);
                tcall.callid = call.callid;
            }
        });
    }

    /**
     * terminate the call
     *
     * @param call
     */
    private terminateCall(call: telephonyCallI) {
        if (call.callid) {
            this.backend.deleteRequest(`channels/voice/StarFaceVOIP/call/${call.callid}`).subscribe(deleted => {
                call.status = 'disconnected';
            });
        }
    }

    /* automatically done on teh backend
    private subscribe() {
        this.backend.postRequest('StarFaceVOIP/events').subscribe(res => {
            if (res.status == 'success') {
                this.starfacesubscription = true;
            }
        });
    }

    private unsubscribe() {
        this.backend.deleteRequest('StarFaceVOIP/events').subscribe(res => {
            if (res.status == 'success') {
                this.starfacesubscription = false;
            }
        });
    }
    */

}

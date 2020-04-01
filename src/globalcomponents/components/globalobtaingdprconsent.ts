/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {loginService} from '../../services/login.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { language } from '../../services/language.service';
import { metadata } from '../../services/metadata.service';
import { DomSanitizer } from '@angular/platform-browser';
import { toast } from '../../services/toast.service';
import { backend } from '../../services/backend.service';

@Component({
    selector: 'global-obtain-gdpr-consent',
    templateUrl: './src/globalcomponents/templates/globalobtaingdprconsent.html',
})
export class GlobalObtainGDPRConsent {

    /*
     * The GDPR consent text.
     */
    private consentText: string;

    /*
     * Indicates whether the consent is currently being saved to the backend.
     */
    public isSaving = false;

    constructor( private sanitizer: DomSanitizer, private metadata: metadata, private language: language, private backend: backend, private loginService: loginService, private http: HttpClient, private configuration: configurationService, private session: session, private toast: toast ) {
        this.retrieveConsentText();
    }

    /*
    *   Retrieve the currently defined GDPR consent text from the backend.
    */
    private retrieveConsentText() {
        let headers = new HttpHeaders();
        headers = headers.set('OAuth-Token', this.session.authData.sessionId);
        this.http.get(this.configuration.getBackendUrl() + '/gdpr/portalGDPRconsentText', { headers: headers }).subscribe(( response: any ) => {
            this.consentText = response.portalGDPRconsentText;
        });
    }

    /*
     *  Send the GDPR consent to the backend.
     */
    public save() {
        if ( this.isSaving ) return;
        this.isSaving = true;
        this.backend.postRequest('/gdpr/portalGDPRconsent', null, { consentText: this.consentText } ).subscribe(
            ( response: any ) => {
                this.loginService.session.authData.obtainGDPRconsent = false; // The GDPR consent is no longer missing.
            },
            error => {
                    this.isSaving = false;
                    if ( error.error.error.errorCode === 'wrongConsentText' ) { // To really make sure the consent text is correct.
                        this.consentText = error.error.error.details.properConsentText;
                    } else {
                        this.toast.sendToast('Error saving the GDPR consent.', 'error', 'Try again or consult the administrator.');
                    }
                }
            );
    }

    public canSave(): boolean {
        return this.consentText && !this.isSaving;
    }

}

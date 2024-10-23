import {Component} from '@angular/core';
import {GlobalLoginPasskeyModal} from "../../../globalcomponents/components/globalloginpasskeymodal";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'user-security-passkey-button',
    templateUrl: '../templates/usersecuritypasskeybutton.html'
})

export class UserSecurityPasskeyButton {
    /**
     * holds the registered passkey name and icon
     */
    public passkeyMetadata: {name: string, icon_dark: string, icon_light: string} = undefined;
    /**
     * loading flag for passkey
     */
    public loadingPasskey: boolean = false;

    constructor(private backend: backend, private modal: modal, private session: session) {
        this.checkPasskey();
    }

    /**
     * create a passkey
     */
    public createPasskey() {
        if (this.passkeyMetadata) {
            const isDeleting = this.modal.await('LBL_PROCESSING');
            this.backend.deleteRequest('authentication/passkey/' + this.session.authData.userId, {rpId: window.location.hostname}).subscribe({
                next: () => {
                    this.passkeyMetadata = undefined;
                }
            });
        } else {
            this.modal.openStaticModal(GlobalLoginPasskeyModal, true);
        }
    }

    /**
     * check if a passkey exists for the user
     */
    public checkPasskey() {
        this.loadingPasskey = true;

        this.backend.getRequest('authentication/passkey/' + this.session.authData.userId, {rpId: window.location.hostname}).subscribe({
            next: res => {
                this.loadingPasskey = false;
                this.passkeyMetadata = res;
            },
            error: () => this.loadingPasskey = false
        });
    }

    /**
     * remove passkey
     */
    public removePasskey() {
        this.loadingPasskey = true;

        this.backend.deleteRequest('authentication/passkey/' + this.session.authData.userId, {rpId: window.location.hostname}).subscribe({
            next: () => {
                this.passkeyMetadata = undefined;
                this.loadingPasskey = false;
            },
            error: () => this.loadingPasskey = false
        });
    }
}
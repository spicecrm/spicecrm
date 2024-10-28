import {Component, ComponentRef, OnDestroy, Output} from '@angular/core';
import {backend} from "../../services/backend.service";
import {ModalComponentI} from "../../objectcomponents/interfaces/objectcomponents.interfaces";
import {toast} from "../../services/toast.service";
import {Subject} from "rxjs";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'global-login-passkey-modal',
    templateUrl: '../templates/globalloginpasskeymodal.html'
})

export class GlobalLoginPasskeyModal implements ModalComponentI, OnDestroy {
    /**
     * reference to self
     */
    public self: ComponentRef<GlobalLoginPasskeyModal>;
    /**
     * emit on success
     */
    @Output() onSuccess$ = new Subject<{name: string, icon_light: string, icon_dark: string}>();

    constructor(private backend: backend,
                private modal: modal,
                private toast: toast) {
    }

    /**
     * create a new passkey
     */
    public createRegistration() {

        if (!navigator.credentials || !navigator.credentials.create) {
            return console.error('Passkey authentication Browser not supported.');
        }

        const loading = this.modal.await('LBL_PROCESSING');

        this.backend.postRequest('authentication/passkey/createArgs', null, {rpId: window.location.hostname}).subscribe({
            next: async createArgs => {
                // error handling
                if (createArgs.success === false) {
                    return console.error('passkey create args error: ', createArgs.msg || 'unknown error occured');
                }

                const secret = createArgs.secret;
                createArgs = window._.omit(createArgs, ['secret']);

                // replace binary base64 data with ArrayBuffer. a other way to do this
                // is the reviver function of JSON.parse()
                this.recursiveBase64StrToArrayBuffer(window._.omit(createArgs, ['secret']));

                // create credentials
                const cred: any = await navigator.credentials.create(createArgs);

                // create object
                const authenticatorAttestationResponse = {
                    transports: cred.response.getTransports ? cred.response.getTransports() : null,
                    clientDataJSON: cred.response.clientDataJSON ? this.arrayBufferToBase64(cred.response.clientDataJSON) : null,
                    attestationObject: cred.response.attestationObject ? this.arrayBufferToBase64(cred.response.attestationObject) : null,
                    secret,
                    rpId: window.location.hostname
                };

                this.backend.postRequest('authentication/passkey/processCreate', null, authenticatorAttestationResponse).subscribe({
                    next: authenticatorAttestationServerResponse => {

                        loading.next(true);
                        loading.complete();

                        if (authenticatorAttestationServerResponse.success) {
                            this.toast.sendToast('LBL_SUCCESS', 'success');
                            this.onSuccess$.next(authenticatorAttestationServerResponse.metadata);
                            this.onSuccess$.complete();
                            this.cancel();
                        } else {
                            this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                            console.error('passkey create args error: ', authenticatorAttestationServerResponse.msg || 'unknown error occured');
                        }
                    },
                    error: () => {
                        loading.next(true);
                        loading.complete();
                        this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                    }
                });
            },
            error: () => {
                loading.next(true);
                loading.complete();
                this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });

    }

    public cancel() {
        this.self.destroy();
    }

    /**
     * Convert a ArrayBuffer to Base64
     * @param buffer
     * @returns string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * convert RFC 1342-like base64 strings to array buffer
     * @param obj
     */
    private recursiveBase64StrToArrayBuffer(obj) {
        let prefix = '=?BINARY?B?';
        let suffix = '?=';
        if (typeof obj === 'object') {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    let str = obj[key];
                    if (str.substring(0, prefix.length) === prefix && str.substring(str.length - suffix.length) === suffix) {
                        str = str.substring(prefix.length, str.length - suffix.length);

                        let binary_string = window.atob(str);
                        let len = binary_string.length;
                        let bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binary_string.charCodeAt(i);
                        }
                        obj[key] = bytes.buffer;
                    }
                } else {
                    this.recursiveBase64StrToArrayBuffer(obj[key]);
                }
            }
        }
    }

    public ngOnDestroy() {
        this.onSuccess$.complete();
    }
}
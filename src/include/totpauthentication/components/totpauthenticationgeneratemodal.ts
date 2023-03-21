/**
 * @module ModuleTOTPAuthentication
 */
import { Component, Input, OnInit } from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
import {take} from 'rxjs/operators';
import { model } from '../../../services/model.service';
import { session } from '../../../services/session.service';
import {Subject} from "rxjs";

@Component({
    selector: "totp-authentication-generate-modal",
    templateUrl: "../templates/totpauthenticationgeneratemodal.html"
})
export class TOTPAuthenticationGenerateModal implements OnInit {

    /**
     * reference to the modal
     *
     * @private
     */
    public self: any;

    /**
     * the base 64 encoded QR code
     * @private
     */
    public QRCode: string;

    /**
     * the secret generated
     *
     * @private
     */
    public secret: string;

    public name: string;

    /**
     * the code entered to validate
     *
     * @private
     */
    public code: string = '';

    @Input() public onBehalfUserId: string;

    public response = new Subject<boolean>();

    constructor(public language: language, public metadata: metadata, public modal: modal, public backend: backend, public toast: toast, public model: model, public session: session ) {

    }

    public ngOnInit() {
        let loading = this.modal.await(this.language.getLabel('MSG_TOTP_GENERATING_CODE'));
        this.backend.postRequest(`authentication/totp/generate`, { onBehalfUserId: this.onBehalfUserId })
            .subscribe({
            next: res => {
                loading.emit(true);
                if (res.secret) {
                    this.QRCode = 'data:image/png;base64,' + res.qrcode;
                    this.secret = res.secret;
                    this.name = res.name;
                    this.response.next(true);
                } else {
                    this.toast.sendToast('Error generating Code', 'error');
                    this.response.next(false);
                    this.close();
                }
            },
            error: () => {
                this.toast.sendToast('Error generating Code', 'error');
                this.response.next(false);
                this.close();
                loading.emit(true);
            }});
    }

    /**
     * closes the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    public save() {
        this.backend.putRequest(`authentication/totp/validate/${this.code}`, { onBehalfUserId: this.onBehalfUserId })
            .subscribe( {
                next: res => {
                    if( res.validated ) {
                        this.response.next(true);
                        this.close();
                    } else {
                        this.response.next(false);
                        this.toast.sendToast( 'Error validating your code', 'warning', 'the code you entered is not valid, please try again', true );
                    }
                    this.code = '';
                },
                error: () => {
                    this.response.next(false);
                    this.toast.sendToast( 'Error validating your code', 'error', 'there as an internal error validating your request', true );
                    this.code = '';
                }
            });
    }

}

/**
 * @module ModuleTOTPAuthentication
 */
import {Component, OnInit} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "totp-authentication-generate-modal",
    templateUrl: "./src/include/totpauthentication/templates/totpauthenticationgeneratemodal.html"
})
export class TOTPAuthenticationGenerateModal implements OnInit {

    /**
     * reference to the modal
     *
     * @private
     */
    private self: any;

    /**
     * the base 64 encoded QR code
     * @private
     */
    private QRCode: string;

    /**
     * the secret generated
     *
     * @private
     */
    private secret: string;

    private name: string;

    /**
     * the code entered to validate
     *
     * @private
     */
    private code: string = '';

    constructor(private language: language, private metadata: metadata, private modal: modal, private model: model, private backend: backend, private toast: toast) {

    }

    public ngOnInit() {
        let await = this.modal.await(this.language.getLabel('MSG_TOTP_GENERATING_CODE'));
        this.backend.getRequest(`authentication/totp/generate`).subscribe(
            res => {
                await.emit(true);
                if (res.secret) {
                    this.QRCode = 'data:image/png;base64,' + res.qrcode;
                    this.secret = res.secret;
                    this.name = res.name;
                } else {
                    this.toast.sendToast('Error generating Code', 'error');
                    this.close();
                }
            },
            () => {
                this.toast.sendToast('Error generating Code', 'error');
                this.close();
                await.emit(true);
            });
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    private save() {
        this.backend.putRequest(`authentication/totp/validate/${this.code}`).subscribe(
            res => {
                if (res.validated) {
                    this.close();
                } else {
                    this.toast.sendToast('Error validating your code', 'warning', 'the code you entered is not valid, please try again', true);
                }
                this.code = '';
            },
            () => {
                this.toast.sendToast('Error validating your code', 'error', 'there as an internal error validating your request', true);
                this.code = '';
            }
        );
    }

}

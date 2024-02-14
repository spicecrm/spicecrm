/**
 * @module ModuleTOTPAuthentication
 */
import {Component, Input, OnInit, Output} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";
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

    @Output() public onValidationSuccess = new Subject<void>();

    public credentials: {username: string, password: string};

    public response = new Subject<boolean>();

    constructor(
        public language: language,
        public metadata: metadata,
        public modal: modal,
        public backend: backend,
        public toast: toast,
        public session: session
    ) {

    }

    public ngOnInit() {
        let params: any = {};
        if(this.onBehalfUserId) params.onBehalfUserId = this.onBehalfUserId;
        let loading = this.modal.await(this.language.getLabel('MSG_TOTP_GENERATING_CODE'));
        this.backend.postRequest(`authentication/totp/generate`, { onBehalfUserId: this.onBehalfUserId }, this.credentials)
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
        this.backend.putRequest(`authentication/totp/validate/${this.code}`, { onBehalfUserId: this.onBehalfUserId }, this.credentials)
            .subscribe( {
                next: res => {
                    if( res.validated ) {
                        this.response.next(true);

                        if(this.onBehalfUserId == this.session.authData.userId){
                            this.session.authData.user.user_2fa_method = 'one_time_password';
                        }
                        this.onValidationSuccess.next();
                        this.onValidationSuccess.complete();
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

/**
 * @module ModuleTOTPAuthentication
 */
import {Component, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {language} from "../../../services/language.service";

@Component({
    selector: "totp-authenticatio-generate-button",
    templateUrl: "../templates/totpauthenticationgeneratebutton.html"
})
export class TOTPAuthenticationGenerateButton {

    constructor(public language: language, public model: model, public modal: modal, public backend: backend, public injector: Injector) {

    }

    public execute() {
        let loading = this.modal.await(this.language.getLabel('MSG_TOTP_STATUSCHECK'));
        this.backend.getRequest(`authentication/totp`).subscribe(
            res => {
                loading.emit(true);
                if (res.active) {
                    this.modal.confirm(this.language.getLabel('MSG_TOTP_DELETE', null, 'long'), this.language.getLabel('MSG_TOTP_DELETE')).subscribe(a => {
                        if (a) {
                            loading = this.modal.await(this.language.getLabel('MSG_TOTP_DELETING'));
                            this.backend.deleteRequest(`authentication/totp`).subscribe(
                                res => {
                                    loading.emit(true);
                                    this.generateTOTP();
                                },
                                () => {
                                    loading.emit(true);
                                }
                            );
                        }
                    });
                } else {
                    this.generateTOTP();
                }
            },
            () => {
                loading.emit(true);
            }
        );
    }

    public generateTOTP() {
        this.modal.openModal('TOTPAuthenticationGenerateModal', true, this.injector);
    }

}

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
    templateUrl: "./src/include/totpauthentication/templates/totpauthenticationgeneratebutton.html"
})
export class TOTPAuthenticationGenerateButton {

    constructor(private language: language, private model: model, private modal: modal, private backend: backend, private injector: Injector) {

    }

    public execute() {
        let await = this.modal.await(this.language.getLabel('MSG_TOTP_STATUSCHECK'));
        this.backend.getRequest(`authentication/totp`).subscribe(
            res => {
                await.emit(true);
                if (res.active) {
                    this.modal.confirm(this.language.getLabel('MSG_TOTP_DELETE', null, 'long'), this.language.getLabel('MSG_TOTP_DELETE')).subscribe(a => {
                        if (a) {
                            await = this.modal.await(this.language.getLabel('MSG_TOTP_DELETING'));
                            this.backend.deleteRequest(`authentication/totp`).subscribe(
                                res => {
                                    await.emit(true);
                                    this.generateTOTP();
                                },
                                () => {
                                    await.emit(true);
                                }
                            );
                        }
                    });
                } else {
                    this.generateTOTP();
                }
            },
            () => {
                await.emit(true);
            }
        );
    }

    private generateTOTP() {
        this.modal.openModal('TOTPAuthenticationGenerateModal', true, this.injector);
    }

}

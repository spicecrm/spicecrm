import {Component} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: "./src/modules/users/templates/userresetpasswordbutton.html"
})

export class UserResetPasswordButton {

    constructor(private modal: modal, private language: language, private model: model, private session: session) {}

    private resetPassword() {
        if (!this.session.isAdmin) {return;}
        this.modal.openModal("UserResetPasswordModal")
            .subscribe( modalRef => {
                modalRef.instance.userId = this.model.id;
            });
    }
}

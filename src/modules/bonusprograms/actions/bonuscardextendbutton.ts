/**
 * @module ModuleBonusPrograms
 */
import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";

/**
 * a button to display an extend modal for the bonus card
 */
@Component({
    templateUrl: './src/modules/bonusprograms/templates/bonuscardextendbutton.html'
})
export class BonusCardExtendButton {

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public userpreferences: userpreferences) {
    }

    public execute() {
        const loading = this.modal.await(this.language.getLabel('LBL_CALCULATING'));
        this.backend.getRequest(`module/BonusPrograms/${this.model.getField('bonusprogram_id')}/extensionvaliditydate`).subscribe(res => {

            loading.emit();

            if (!res.extendable) {
                this.toast.sendToast(this.language.getLabel('MSG_EXTENDING_NOT_ALLOWED'));
            } else {
                this.modal.confirm('').subscribe(answer => {
                    if (!answer) return;

                    // todo add new card an its extension
                });
            }
        });
    }
}

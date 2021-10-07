/**
 * @module ModuleBonusPrograms
 */
import {Component, SkipSelf} from '@angular/core';
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
    templateUrl: './src/modules/bonusprograms/templates/bonuscardextendbutton.html',
    providers: [model]
})
export class BonusCardExtendButton {

    constructor(public model: model,
                @SkipSelf() public bonusCardModel: model,
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

        const url = `module/BonusPrograms/${this.model.getField('bonusprogram_id')}/extensionvaliditydate`;

        this.backend.getRequest(url).subscribe(res => {

            loading.emit();

            if (!res.success) return;

            if (!res.extendable) {
                this.toast.sendToast(this.language.getLabel('MSG_EXTENDING_NOT_ALLOWED'));
            } else {
                const text = `${this.language.getLabel('MSG_EXTENSION_DATE')} ${res.date_start} ${res.date_end}`;
                this.modal.confirm(text).subscribe(answer => {
                    if (!answer) return;

                    this.model.module = 'BonusCardExtensions';
                    this.model.initialize();
                    this.model.setFields({
                        date_created: res.date_start,
                        valid_until: res.date_end,
                        bonuscard_id: this.bonusCardModel.id
                    });
                });
            }
        });
    }
}

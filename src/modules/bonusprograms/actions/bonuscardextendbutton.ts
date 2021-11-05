/**
 * @module ModuleBonusPrograms
 */
import {Component, SkipSelf} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modelutilities} from "../../../services/modelutilities.service";

/** @ignore */
declare var moment;

/**
 * a button to display an extend modal for the bonus card
 */
@Component({
    templateUrl: './src/modules/bonusprograms/templates/bonuscardextendbutton.html',
    providers: [model]
})
export class BonusCardExtendButton {

    constructor(public extensionModel: model,
                @SkipSelf() public bonusCardModel: model,
                public language: language,
                public metadata: metadata,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public modelUtilities: modelutilities,
                public userpreferences: userpreferences) {
    }

    /**
     * check if extendable then show a confirm modal
     * if the user confirms then create an new extension and update the valid date on the card
     */
    public execute() {

        const loading = this.modal.await(this.language.getLabel('LBL_CALCULATING'));

        const url = `module/BonusCards/${this.bonusCardModel.id}/extensionvaliditydate`;

        this.backend.getRequest(url).subscribe(async (res) => {

            loading.next();
            loading.complete();

            if (!res.extendable) {
                this.toast.sendToast(this.language.getLabel('MSG_EXTENDING_NOT_ALLOWED'));
            } else {
                let newUntilDate = !res.date ? new moment().add('1', 'years') : this.modelUtilities.backend2spice('BonusCards', 'valid_until', res.date);
                const untilDate = (this.bonusCardModel.data.valid_until).format(this.userpreferences.getDateFormat());
                const purchaseDate = this.bonusCardModel.data.purchase_date.format(this.userpreferences.getDateFormat());

                let text = `${this.language.getLabel('LBL_PURCHASE_DATE')} ${purchaseDate} ${this.language.getLabel('LBL_VALID_UNTIL')} ${untilDate} \n ${this.language.getLabel('LBL_NEW_VALID_UNTIL_DATE')}`;

                let confirmAnswer;

                if (res.editable) {
                    confirmAnswer = await this.modal.prompt('input_date', text, 'LBL_EXTEND', 'shade', newUntilDate).toPromise();
                    newUntilDate = confirmAnswer;
                } else {
                    text += ` ${newUntilDate.format(this.userpreferences.getDateFormat())}`;
                    confirmAnswer = await this.modal.confirm(text, 'LBL_EXTEND').toPromise();
                }

                if (!confirmAnswer) return;

                this.bonusCardModel.startEdit();
                this.bonusCardModel.setField('valid_until', newUntilDate);
                this.bonusCardModel.save();

                this.extensionModel.module = 'BonusCardExtensions';
                this.extensionModel.initialize();
                this.extensionModel.setFields({
                    valid_until: newUntilDate,
                    bonuscard_id: this.bonusCardModel.id
                });
                this.extensionModel.save();
            }
        },
            () => this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'))
        );
    }
}

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
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";
import {lastValueFrom} from "rxjs";

/**
 * a button to display an extend modal for the bonus card
 */
@Component({
    templateUrl: '../templates/bonuscardbulkextendbutton.html',
    providers: [model]
})
export class BonusCardBulkExtendButton {

    constructor(public model: model,
                @SkipSelf() public bonusCardModel: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public modellist: modellist,
                public modal: modal,
                public backend: backend,
                public toast: toast,
                public router: Router,
                public modelUtilities: modelutilities,
                public userpreferences: userpreferences) {
    }

    /**
     * returns the number of the selected cards or all in the model list
     */
    get exportCount() {
        return this.modellist.getSelectedCount() ?? this.modellist.listData.totalcount;
    }

    /**
     * ensure we have some items selected
     */
    get disabled() {
        return this.modellist.getSelectedCount() == 0;
    }

    /**
     * get the count of extendable cards and submit on confirm
     */
    public execute() {

        const processing = this.modal.await(this.language.getLabel('LBL_PROCESSING'));

        const url = `module/BonusCards/extendablecards`;
        const cardsIds = this.modellist.getSelectedIDs();

        this.backend.getRequest(url, {cardsIds}).subscribe(async (res) => {

            processing.next(true);
            processing.complete();

            if (res.cardsIds?.length == 0) {
                return this.toast.sendToast(this.language.getLabel('MSG_EXTENDING_NOT_ALLOWED'));
            }

            const text = `${this.language.getLabel('MSG_CARDS_TO_EXTEND')} ${res.cardsIds.length}`;
            const confirmAnswer = await lastValueFrom(this.modal.confirm(text, 'LBL_BULK_EXTEND'));

            if (!confirmAnswer) return;

            this.backend.postRequest(`module/BonusCards/bulkextend`, null, {cardsIds: res.cardsIds}).subscribe(() => {

                this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXTENDED'));
            }, () => {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'));
            });

        },
            () => this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'))
        );
    }
}

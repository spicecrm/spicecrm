import {Component, ComponentRef, signal, WritableSignal} from '@angular/core';
import {apiKeyI} from "../interfaces/users.interfaces";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {language} from "../../../services/language.service";

declare var moment: any;

@Component({
    selector: 'user-api-keys-modal',
    templateUrl: '../templates/userapikeysmodal.html',
    standalone: false
})
export class UserAPIKeysModal {
    /**
     * api keys array
     */
    public apiKeys: WritableSignal<apiKeyI[]> = signal([]);
    /**
     * reference to the modal itself
     */
    public self: ComponentRef<this>;
    /**
     * temporarily hold the key data until save
     */
    public newKey: apiKeyI;

    constructor(private backend: backend,
                private model: model,
                public session: session,
                private userPreferences: userpreferences,
                private language: language,
                private modal: modal) {
    }

    /**+
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * start adding a new key
     */
    public startAdding() {
        this.newKey = {
            id: this.model.generateGuid(),
            expire_on: '',
            created_by_id: this.session.authData.userId,
            created_by_name: this.session.authData.userName,
            is_active: 1,
            user_id: this.model.id,
            valid_for_months: 'never',
            date_entered: this.userPreferences.formatDateTime(moment())
        }
    }

    /**
     * on valid for month change
     * @param value
     */
    public onValidForMonthChange(value: string) {
        this.newKey.expire_on = value == 'never' ? null : this.userPreferences.formatDateTime(moment().add(value, 'months'));
    }

    /**
     * delete a key
     * @param keyId
     */
    public deleteKey(keyId: string) {

        this.modal.confirmDeleteRecord().subscribe(res => {
            if (!res) return;
            const isLoading = this.modal.await('LBL_DELETING');

            this.backend.deleteRequest(`authentication/apiKeys/${keyId}`).subscribe({
                next: () => {
                    isLoading.next(true);
                    isLoading.complete();
                    this.apiKeys.set(
                        [...this.apiKeys().filter(k => k.id != keyId)]
                    );
                },
                error: () => {
                    isLoading.next(true);
                    isLoading.complete();
                    this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
            });
        });
    }

    /**
     * cancel adding a new key
      */
    public cancelAdding() {
        this.newKey = undefined;
    }

    /**
     * toggle the active state of a key
     * @param key
     */
    public toggleActive(key: apiKeyI) {
        const action = key.is_active == 1 ? 'deactivate' : 'activate';

        this.backend.putRequest(`authentication/apiKeys/${key.id}/${action}`).subscribe({
            next: () => {

                key.is_active = key.is_active == 1 ? 0 : 1;

                // reset the api keys array to force a refresh
                this.apiKeys.set(
                    [...this.apiKeys()]
                );
            },
            error: () => {
                this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            }
        });
    }

    /**
     * save the new key
     */
    public saveNewKey() {

        const isLoading = this.modal.await('LBL_PROCESSING');

        const payload = {
            expire_on: !this.newKey.expire_on ? null : moment(this.newKey.expire_on).utc().format('YYYY-MM-DD HH:mm:ss'),
            user_id: this.newKey.user_id,
        };

        this.backend.postRequest(`authentication/apiKeys/${this.newKey.id}`, {}, payload).subscribe({
            next: res => {

                this.newKey = undefined;

                isLoading.next(true);
                isLoading.complete();

                navigator.clipboard.writeText(res.value);

                this.modal.toast.sendToast('LBL_COPIED_TO_CLIPBOARD', 'info');
                this.modal.info(`${this.language.getLabel('MSG_API_KEY_CREATED_DESC', null, 'long')} \n\r ${res.value}`, 'LBL_API_KEY_CREATED');

                res.date_entered = this.model.userpreferences.formatDateTime(res.date_entered);
                if (!!res.expire_on) {
                    res.expire_on = this.model.userpreferences.formatDateTime(res.expire_on);
                }

                this.apiKeys.set(
                    [...this.apiKeys(), res]
                );
            },
            error: () => {
                this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                isLoading.next(false);
                isLoading.complete();
            }
        });

    }
}
import {Component, ChangeDetectionStrategy, inject, Injector, WritableSignal, signal} from '@angular/core';
import {ObjectActionSetItemBase} from "../../../objectcomponents/interfaces/objectactionsetitembase";
import {modal} from "../../../services/modal.service";
import {UserAPIKeysModal} from "./userapikeysmodal";
import {apiKeyI} from "../interfaces/users.interfaces";
import {backend} from "../../../services/backend.service";

@Component({
    selector: 'user-api-keys-button',
    templateUrl: '../templates/userapikeysbutton.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UserAPIKeysButton extends ObjectActionSetItemBase {
    /**
     * reference to modal service
     * @private
     */
    private modal = inject(modal);
    /**
     * reference to backend service
     * @private
     */
    private backend = inject(backend);
    /**
     * reference to injector service
     * @private
     */
    private injector = inject(Injector);
    /**
     * api keys array
     */
    public apiKeys: WritableSignal<apiKeyI[]> = signal([]);

    public ngOnInit() {
        this.loadAPIKeys();
    }

    get hidden(): boolean {
        return super.hidden || this.model.getField('is_api_user') != 1;
    }

    /**
     * open the api keys modal
      */
    public execute() {
        this.modal.openStaticModal(UserAPIKeysModal, true, this.injector).subscribe(modalRef => {
            modalRef.instance.apiKeys = this.apiKeys;
        });
    }

    /**
     * load the api keys
     */
    public loadAPIKeys() {
        this.backend.getRequest(`authentication/apiKeys/${this.model.id}`).subscribe({
            next: (res) => {

                res.forEach((key: apiKeyI) => {
                    key.date_entered = this.model.userpreferences.formatDateTime(key.date_entered);
                    if (!!key.expire_on) {
                        key.expire_on = this.model.userpreferences.formatDateTime(key.expire_on);
                    }
                });

                this.apiKeys.set(res);
            },
        })
    }
}
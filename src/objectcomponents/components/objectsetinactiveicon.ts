/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

/**
 * sets the value of is_inactive field
 */
@Component({
    selector: 'object-set-inactive-icon',
    templateUrl: '../templates/objectsetinactiveicon.html'
})

export class ObjectSetInactiveIcon {

    /**
     * indicator that we are processing currently
     * @private
     */
    public inProcess: boolean = false;

    constructor(
        private backend: backend,
        private model: model,
        private modal: modal,
        public language: language,
        private toast: toast,
        private configuration: configurationService
    ) {
    }

    /**
     * changes the icon
     * inactive: toggle_off
     * active: toggle_on
     */
    get manageIcon(): string {
        return this.model.data.is_inactive == '1' ? 'toggle_off' : 'toggle_on'
    }

    /**
     * changes the color of the icon
     *
     * inactive: error
     * active: default
     */
    get filterColorClass() {
        return this.model.data.is_inactive == '1' ? 'slds-icon-text-error' : 'slds-icon-text-default'
    }

    /**
     * sets is_inactive flag on a Bean
     */
    public manageActiveState() {

        // do nothing if Bean is being edited
        if (this.model.isEditing) return;

        this.inProcess = true;

        if (this.model.data.is_inactive != '1') {
            this.modal.confirm('MSG_DEACTIVATE_RECORD', 'MSG_DEACTIVATE_RECORD', 'error')
                .subscribe(answer => {
                    if (answer) {
                        this.backend.putRequest(`module/${this.model.module}/${this.model.id}/inactive`, null, {isInactive: '1'}).subscribe({
                            next: () => {
                                this.model.data.is_inactive = '1';
                            }, error: err => {
                                this.toast.sendToast(err.error.error.message, 'error');
                            }
                        })
                        this.inProcess = false;

                        if(this.model.module == 'EmailTemplates' || this.model.module == 'OutputTemplates') {
                            this.configuration.setData(this.model.module, undefined);
                        }
                    } else {
                        this.inProcess = false;
                    }
                });
        } else {
            this.modal.confirm('MSG_REACTIVATE_RECORD', 'MSG_REACTIVATE_RECORD', 'warning')
                .subscribe(answer => {
                    if (answer) {
                        this.backend.putRequest(`module/${this.model.module}/${this.model.id}/inactive`, null, {isInactive: '0'}).subscribe({
                            next: () => {
                                this.model.data.is_inactive = '0';
                            }, error: err => {
                                this.toast.sendToast(err.error.error.message, 'error');
                            }
                        })
                        this.inProcess = false;

                        if(this.model.module == 'EmailTemplates' || this.model.module == 'OutputTemplates') {
                            this.configuration.setData(this.model.module, undefined);
                        }
                    } else {
                        this.inProcess = false;
                    }
                });
        }
    }
}
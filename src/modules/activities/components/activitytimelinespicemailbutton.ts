/**
 * @module ModuleActivities
 */
import {Component, OnInit} from '@angular/core';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {model} from "../../../services/model.service";
import {language} from '../../../services/language.service';
import {configurationService} from "../../../services/configuration.service";
import {Clipboard} from '@angular/cdk/clipboard';

/**
 * a button copies a hashed email token
 */
@Component({
    selector: 'activitytimeline-spice-mail-button',
    templateUrl: '../templates/activitytimelinespicemailbutton.html',
})
export class ActivityTimelineSpiceMailButton implements OnInit {

    /**
     * if true the mailboxprocessor is set for a mailbox
     */
    public tokenconfig: boolean = false;

    /**
     * holds result from backend
     */
    public result: any;

    /**
     * holds token value
     * i.e. crm+f75b6e3224659bacbcbb52bac242c5bd@domain.com
     */
    public token: string;

    /**
     * bool value for related email bean
     * set false as default
     */
    public emailbean: boolean = false;

    /**
     * true when getting token from backend
     */
    public tokenLoading: boolean = false;

    constructor(public backend: backend,
                public configuration: configurationService,
                public toast: toast,
                public model: model,
                public language: language,
                public clipboard: Clipboard,
    ) {
    }

    public ngOnInit() {
        this.checkEmailRel();
        this.getMailboxToken();
    }

    /**
     * checks if relationship to Email exists
     */
    public checkEmailRel(): void {
        let modelfields = this.model._fields;
        Object.entries(modelfields).forEach(([key, value], index) => {
            if (value[`type`] == 'link' && value[`module`] == 'Emails') {
                this.emailbean = true;
            }
        });
    }

    /**
     * checks if the mailbox uses SpiceMailToken processor
     */
    public getMailboxToken(): void {
        this.backend.getRequest('spicemailtoken/mailboxprocessor').subscribe({
            next: (result) => {
                this.tokenconfig = result.tokenConfig;
            }
        });
    }

    /**
     * handles button visibility
     * if token config is not set
     * and bean has no relationship with Email
     * button is not displayed
     */
    public handleVisibility(): object {
        if (!this.tokenconfig || !this.emailbean) {
            return {display: 'none'};
        } else {
            return {display: 'block'};
        }
    }

    /**
     * retrieves existing or creates a new hashed token
     */
    public getToken(event): void {
        this.tokenLoading = true;

        event.preventDefault();
        event.stopPropagation();
        this.backend.getRequest('spicemailtoken/' + this.model.module + '/' + this.model.id).subscribe({
            next: (result) => {
                this.token = result.tokenEmail;
                this.clipboard.copy(this.token);
                this.toast.sendToast(this.language.getLabel('LBL_DATA_COPIED') + ': ' + this.token, 'success');
                this.tokenLoading = false;
            }, error: () => {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR_COPYING_DATA'), 'error');
                this.tokenLoading = false;
            }
        });
    }

}

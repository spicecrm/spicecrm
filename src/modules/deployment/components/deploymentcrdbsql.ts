/**
 * @module ModuleDeployment
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {model} from '../../../services/model.service';

/**
 * renders a modal with the SQL and allows copying to Clipboard
 */
@Component({
    templateUrl: '../templates/deploymentcrdbsql.html',
})
export class DeploymentCRDBSQL implements OnInit {

    /**
     * reference toi the modal
     */
    public self: any;

    /**
     * indicates that the modal is loading
     */
    public loading = true;

    /**
     * the generated SQL Statement
     */
    public sql: string = '';

    constructor(public backend: backend, public model: model, public language: language, public toast: toast) {

    }

    /**
     * generate the SQL on init
     */
    public ngOnInit() {
        this.backend.getRequest('module/SystemDeploymentCRs/' + this.model.id + '/sql').subscribe(result => {
            this.loading = false;
            this.sql = result.sql;
        });
    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * copy the SQL to clipboard
     */
    public copy2clipboard() {
        navigator.clipboard.writeText(this.sql).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }
}

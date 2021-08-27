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
    templateUrl: './src/modules/deployment/templates/deploymentcrdbsql.html',
})
export class DeploymentCRDBSQL implements OnInit {

    /**
     * reference toi the modal
     */
    private self: any;

    /**
     * indicates that the modal is loading
     */
    private loading = true;

    /**
     * the generated SQL Statement
     */
    private sql: string = '';

    constructor(private backend: backend, private model: model, private language: language, private toast: toast) {

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
    private close() {
        this.self.destroy();
    }

    /**
     * copy the SQL to clipboard
     */
    private copy2clipboard() {
        navigator.clipboard.writeText(this.sql).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }
}

/**
 * @module CleverReachModule
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {Router} from "@angular/router";
import {backend} from '../../../services/backend.service';
import {toast} from "../../../services/toast.service";
import {FormGroup, FormControl} from '@angular/forms';

@Component({
    templateUrl: '../templates/createmailingmodal.html'
})
export class CreateMailingModal implements OnInit {

    public self: any = {};
    public module: string = '';
    public templates: any[] = [];
    public selectedTemplate = "";
    public mailing = new FormGroup({
        name: new FormControl(''),
        subject: new FormControl(''),
        html: new FormControl(''),
    });

    constructor(
        public language: language,
        public router: Router,
        public metadata: metadata,
        public backend: backend,
        public model: model,
        public modal: modal,
        public toast: toast
    ) {
    }

    /**
     * After the app has initialized, loadTemplates() is fired
     */

    public ngOnInit() {
        this.loadTemplates();
    }

    /**
     * loads all templates from backend
     */

    public loadTemplates() {
        this.backend.getRequest(`module/EmailTemplates/${this.model.module}/load`).subscribe(
            response => {
                this.templates = response;
            }
        );
    }

    /**
     *the change event triggers the change of value for selected item
     *
     * the selected template is then parsed
     *
     * the html formcontrol value is the parsed html body of the response
     */

    public renderTemplate(id) {
        this.selectedTemplate = id;
        this.backend.getRequest(`module/EmailTemplates/${this.selectedTemplate}/parse/${this.model.module}/${this.model.id}`).subscribe(
            response => {
                this.mailing.patchValue({html: response.body_html});
            }
        );
    }

    /**
     * post request creates a mailing with the values of the formgroup
     *
     * the response is the mailing id
     *
     */

    public onSubmit() {
        this.backend.postRequest(`channels/emarketing/cleverreach/${this.model.module}/${this.model.id}/sendmailing`, null, this.mailing.value).subscribe(
            response => {
                this.toast.sendToast(this.language.getLabel('LBL_COMPLETED'));
                this.model.setField('mailing_id', response.mailing_id);
                this.model.save();
                this.router.navigate([`/module/${this.model.module}/${this.model.id}`]);
                this.close();
            },
            (error) => {
                this.toast.sendAlert(this.language.getLabel('LBL_ERROR'));
                console.error(error);
            }
        );

    }

    public close() {
        this.self.destroy();
    }


}

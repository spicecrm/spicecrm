/**
 * @module ModuleEmails
 */
import {Component, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {toast} from "../../../services/toast.service";
import {backend} from "../../../services/backend.service";


@Component({
    selector: "email-schedules-related-button",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedbutton.html",
})
export class EmailSchedulesRelatedButton {
    public linkedBeans: any = [];
    public disabled: boolean = false;
    public modelId: string;
    public currentModule: string;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend,
        private toast: toast,
    ) {
    }

    /**
     *  check if emails can be sent to the related objects when the component initializes
     */
    public ngOnInit() {
        this.checkEmailsLink();
    }

    /**
     *  subscribe and save the instances of linkedbeans, modelid and currentmodule to use them in the modal that will open
     */
    public execute() {
        this.modal.openModal('EmailSchedulesRelatedModal', true, this.injector).subscribe( modal => {
               modal.instance.linkedBeans = this.linkedBeans;
               modal.instance.modelId = this.modelId;
               modal.instance.currentModule = this.model.module;
            });
    }

    /**
     * iterate through the model fields, find each field that is of type link, get the module name, and find these modules have an emails link and an email address, by iterating through
     * the fielddefs of metadata
     * pass the object as parameter in the get request
     */
    private checkEmailsLink() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';
            let arrayOfModules = [];
            Object.keys(this.model.fields).forEach(item => {
                if (this.model.fields[item].type == 'link' && this.model.fields[item].hasOwnProperty('vname') && !this.model.fields[item].hasOwnProperty('link_type')) {
                    let module = this.model.fields[item].name;
                    for(let key in this.metadata.fieldDefs) {
                        if(key.toLowerCase() == module) {
                            arrayOfModules.push(key);
                        }
                    }
                }
            });
            let filteredModules = [];
            for(let pos in arrayOfModules) {
                let module = arrayOfModules[pos];
                Object.keys(this.metadata.fieldDefs).forEach(item => {
                    if(this.metadata.fieldDefs[item] != null && item == module) {
                        if(this.metadata.fieldDefs[item].hasOwnProperty('email') && this.metadata.fieldDefs[item].hasOwnProperty('email1')) {
                            filteredModules.push(module);
                        }
                    }
                });
            }
            let params = {modules: filteredModules};
            this.backend.getRequest(`/module/EmailSchedules/checkRelated/${this.model.module}/${this.model.id}`, params).subscribe(result => {
                loadingRef.instance.self.destroy();
                if (result.status) {
                    this.linkedBeans = result.linkedBeans;
                    this.modelId = result.beanId;
                } else {
                    this.toast.sendToast(result.msg, 'error');
                }
            });
        });
    }

}

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
import {Observable, Subject} from "rxjs";


@Component({
    selector: "email-schedules-related-button",
    templateUrl: "../templates/emailschedulesrelatedbutton.html",
})
export class EmailSchedulesRelatedButton {
    public linkedBeans: any = [];
    public modelId: string;
    public currentModule: string;

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector,
        public backend: backend,
        public toast: toast,
    ) {
    }


    /**
     *  execute checkemailslink and await the response
     *  subscribe and save the instances of linkedbeans, modelid and currentmodule to use them in the modal that will open
     */
    public execute() {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.checkEmailsLink().subscribe(response => {
            loadingModal.emit(true);
            if (response) {
                this.modal.openModal('EmailSchedulesRelatedModal', true, this.injector).subscribe(modal => {
                    modal.instance.linkedBeans = this.linkedBeans;
                    modal.instance.modelId = this.modelId;
                    modal.instance.currentModule = this.model.module;
                });
            }
        });
    }

    /**
     * iterate through the model fields, find each field that is of type link, get the module name, and find these modules have an emails link and an email address, by iterating through
     * the fielddefs of metadata
     * pass the object as parameter in the get request
     * return an observable
     */
    public checkEmailsLink(): Observable<any> {
        let responseSubject = new Subject<any>();
        let arrayOfModules = [];
        // search for fields of type link to get the related modules, proof that each of these is actually a module by looping through the fielddefs of metadata where all the object
        // properties are the names of the modules, if this is true then, push this property(key) to the arrayOfModules
        Object.keys(this.model.fields).forEach(item => {
            if (this.model.fields[item].type == 'link') {
                let module = this.model.fields[item].name;
                for (let key in this.metadata.fieldDefs) {
                    if (key.toLowerCase() == module) {
                        arrayOfModules.push(key);
                    }
                }
            }
        });
        // filter the arrayOfModules by looping first through the array and saving the name of the module at each position (pos)
        // then loop through the fielddefs of metadata and verify if email and email1 are properties of each module in arrayOfModule, if both check true than push
        // the module into filteredModules
        let filteredModules = [];
        for (let pos in arrayOfModules) {
            let module = arrayOfModules[pos];
            Object.keys(this.metadata.fieldDefs).forEach(item => {
                if (this.metadata.fieldDefs[item] != null && item == module) {
                    if (this.metadata.fieldDefs[item].hasOwnProperty('email') || this.metadata.fieldDefs[item].hasOwnProperty('email1')) {
                        filteredModules.push(module);
                    }
                }
            });
        }
        let params = {modules: filteredModules};
        this.backend.getRequest(`module/EmailSchedules/${this.model.module}/${this.model.id}`, params).subscribe(result => {
            if (result.status) {
                this.linkedBeans = result.linkedBeans;
                this.modelId = result.beanId;
                responseSubject.next(result.status);
            } else {
                responseSubject.next(false);
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
            // add the corresponding labels
            for (let bean in this.linkedBeans) {
                let link = this.linkedBeans[bean];
                link.vname = this.model.fields[link.link].vname;
            }
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }
}

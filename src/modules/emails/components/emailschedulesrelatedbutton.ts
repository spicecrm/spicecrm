/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedbutton.html",
})
export class EmailSchedulesRelatedButton {
    public linkedBeans: any = [];
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
     *  execute checkemailslink and await the response
     *  subscribe and save the instances of linkedbeans, modelid and currentmodule to use them in the modal that will open
     */
    public execute() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.checkEmailsLink().subscribe(response => {
            await.emit(true);
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
    private checkEmailsLink(): Observable<any> {
        let responseSubject = new Subject<any>();
        let arrayOfModules = [];
        // search for fields of type link to get the related modules, proof that each of these is actually a module by looping through the fielddefs of metadata where all the object
        // properties are the names of the modules, if this is true then, push this property(key) to the arrayOfModules
        Object.keys(this.model.fields).forEach(item => {
            if (this.model.fields[item].type == 'link' && this.model.fields[item].hasOwnProperty('vname') && !this.model.fields[item].hasOwnProperty('link_type')) {
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
                    if (this.metadata.fieldDefs[item].hasOwnProperty('email') && this.metadata.fieldDefs[item].hasOwnProperty('email1')) {
                        filteredModules.push(module);
                    }
                }
            });
        }
        let params = {modules: filteredModules};
        this.backend.getRequest(`module/EmailSchedules/checkRelated/${this.model.module}/${this.model.id}`, params).subscribe(result => {
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

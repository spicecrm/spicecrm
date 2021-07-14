/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'field-email-templates',
    templateUrl: './src/objectfields/templates/fieldemailtemplates.html'
})
export class fieldEmailTemplates extends fieldGeneric implements OnInit {

    private isLoaded: boolean = false;
    private availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private modal: modal,
        private configuration: configurationService
    ) {
        super(model, view, language, metadata, router);
    }

    get subjectField() {
        return this.fieldconfig.subject ? this.fieldconfig.subject : 'name';
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'body';
    }

    get addtocurrentquote() {
        return this.fieldconfig.addtocurrentquote == true ? true : false;
    }


    get isDisabled() {
        return !this.model.getFieldValue('parent_type') || this.model.getFieldValue('parent_type') == '' || !this.isLoaded ? true : false || this.availableTemplates.length == 0;
    }

    private getValue() {
        for (let template of this.availableTemplates) {
            if (template.id == this.value) {
                return template.name;
            }
        }
    }

    /**
     * get the templates for the bean
     *
     * ToDo: swicth to separate route without the old filter style
     */
    public ngOnInit() {

        let emailTemplates = this.configuration.getData('EmailTemplates');
        if (emailTemplates) {
            this.availableTemplates = emailTemplates.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.model.getFieldValue('parent_type')));
            this.isLoaded = true;
        } else {
            let params = {
                start: 0,
                limit: 500,
                listid: 'all'
            };
            this.backend.getRequest('module/EmailTemplates', params).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('EmailTemplates', data.list);

                    // set the templates internally
                    this.availableTemplates = data.list.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.model.getFieldValue('parent_type')));

                    this.isLoaded = true;
                }
            );
        }

    }

    /**
     * fires when the template is selected and triggers the parser
     *
     * @param event
     */
    private chooseTemplate(event) {
        if (this.value != '') {
            this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
                this.backend.getRequest('module/EmailTemplates/' + this.value + '/parse/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    // nur überschreiben wenn nicht bereits ein subject angegeben wurde.
                    if (!this.model.data[this.subjectField]) {
                        this.model.setField(this.subjectField, data.subject);
                    }
                    // Check if element with class "spicecrm_quote" should kept on the bottom (it is for the email-reply)
                    if(this.addtocurrentquote) {

                        // create a new document to manage the current html string (body)
                        let virtualDocument = document.implementation.createHTMLDocument("Virtual Document");
                        virtualDocument.documentElement.innerHTML = this.model.getFieldValue(this.bodyField);
                        let selectedEle = virtualDocument.querySelectorAll(".spicecrm_quote");

                        // keep the html with the class "spicecrm_quote" and set the template
                        this.model.setField(this.bodyField, data.body_html + selectedEle[0].outerHTML);
                    } else {
                        this.model.setField(this.bodyField, data.body_html);
                    }
                    modalRef.instance.self.destroy();
                });
            });
        }
    }
}

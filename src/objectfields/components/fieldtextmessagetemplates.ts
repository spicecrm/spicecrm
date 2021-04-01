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
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'field-textmessage-templates',
    templateUrl: './src/objectfields/templates/fieldtextmessagetemplates.html'
})
export class fieldTextMessageTemplates extends fieldGeneric implements OnInit {

    private isLoaded: boolean = false;
    private availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'body';
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

    public ngOnInit() {
        let templateFilterParams = {
            searchfields: JSON.stringify({join: 'AND', conditions:[]})
        };

        this.backend.getRequest('module/TextMessageTemplates', templateFilterParams).subscribe((data: any) => {
            this.availableTemplates = data.list;
            this.isLoaded = true;
        });


    }

    public chooseTemplate(event) {

        if(this.value != '') {
            this.modal.openModal('SystemLoadingModal', false ).subscribe(modalRef => {
                this.backend.getRequest('TextMessageTemplates/parse/' + this.value + '/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    this.model.setField(this.bodyField, data.body_html);
                    modalRef.instance.self.destroy();
                });
            });
        }

    }
}

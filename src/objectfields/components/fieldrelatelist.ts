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
import {Component, ElementRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

@Component({
    selector: 'field-relate-list',
    templateUrl: './src/objectfields/templates/fieldrelatelist.html'
})
export class fieldRelateList extends fieldGeneric implements OnInit {
    public relatedList: any[] = [];
    private relateIdField: string = '';
    private relateNameField: string = '';
    private relateType: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public modal: modal,
        public backend: backend,
        public toast: toast
    ) {
        super(model, view, language, metadata, router);
    }

    get relatedFieldId() {
        return this.model.getField(this.relateIdField);
    }

    set relatedFieldId(id) {
        let item = this.relatedList.find(item => item.id == id);
        if (!item) {
            return;
        }
        this.model.setField(this.relateIdField, item.id);
        this.model.setField(this.relateNameField, item.summary_text);

        if (!this.relateType) {
            return;
        }
        if (this.fieldconfig.executeCopyRules == 2) {
            this.executeCopyRules(item.id);
        } else if (this.fieldconfig.executeCopyRules == 1) {
            this.modal.confirm('Copy the data from related record?', 'Copy data?').subscribe(answer => answer && this.executeCopyRules(item.id));
        }
    }

    public ngOnInit() {
        this.setFieldDefs();
        this.getRelatedList();
    }

    private setFieldDefs() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    private getRelatedList() {
        if (!this.relateType) {
            return;
        }
        let params = {limit: this.fieldconfig.limit || -1, modulefilter: this.fieldconfig.modulefilter};
        this.backend.getList(this.relateType, [{sortfield: 'name', sortirection: 'ASC'}], params)
            .subscribe((res: any) => {
                if (res && res.list) {
                    this.relatedList = res.list;
                }
            });
    }

    private executeCopyRules(idRelated) {
        let awaitStopper = this.modal.await('LBL_LOADING');
        this.backend.get(this.relateType, idRelated).subscribe(
            (response: any) => {
                let relateModel = {
                    module: this.relateType,
                    id: response.id,
                    data: response
                };
                this.model.executeCopyRulesParent(relateModel);
                awaitStopper.emit();
            },
            () => {
                this.toast.sendToast('ERR_LOADING_RECORD', 'error');
                awaitStopper.emit();
            });
    }

    private trackByFn(index, item) {
        return item.id;
    }
}

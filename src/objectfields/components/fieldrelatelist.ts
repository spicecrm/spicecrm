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
    templateUrl: '../templates/fieldrelatelist.html'
})
export class fieldRelateList extends fieldGeneric implements OnInit {
    public relatedList: any[] = [];
    public relateIdField: string = '';
    public relateNameField: string = '';
    public relateType: string = '';

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

    public setFieldDefs() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    public getRelatedList() {
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

    public executeCopyRules(idRelated) {
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

    public trackByFn(index, item) {
        return item.id;
    }
}

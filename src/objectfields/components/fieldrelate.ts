import {Component, ElementRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

@Component({
    selector: 'field-relate',
    templateUrl: './src/objectfields/templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelate extends fieldGeneric implements OnInit {
    private relateIdField: string = '';
    private relateNameField: string = '';
    private relateType: string = '';
    private relateSearchOpen: boolean = false;
    private relateSearchTerm: string = '';

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

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    get disableadd() {
        return this.fieldconfig.disableadd ? true : false;
    }

    private closePopups() {
        if (this.model.data[this.relateIdField]) {
            this.relateSearchTerm = '';
        }
        this.relateSearchOpen = false;
    }

    private clearField() {
        this.model.data[this.relateNameField] = '';
        this.model.setField(this.relateIdField, '');
    }

    private onFocus() {
        this.relateSearchOpen = true;
    }

    private setRelated(related) {
        this.model.data[this.relateIdField] = related.id;
        this.model.data[this.relateNameField] = related.text;
        if (this.fieldconfig.executeCopyRules == 2) {
            this.executeCopyRules(related.id);
        } else if (this.fieldconfig.executeCopyRules == 1) {
            this.modal.confirm('Copy the data from related record?', 'Copy data?').subscribe(answer => answer && this.executeCopyRules(related.id));
        }
        this.closePopups();
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

    private goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }

    private searchWithModal() {
        this.relateSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.modulefilter = this.fieldconfig.modulefilter;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.setRelated({id: items[0].id, text: items[0].summary_text, data: items[0]});
                }
            });
            selectModal.instance.searchTerm = this.relateSearchTerm;
        });
    }

}

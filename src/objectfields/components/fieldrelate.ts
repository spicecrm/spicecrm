import {Component, ElementRef, Renderer, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';

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
        public renderer: Renderer,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
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

    public onFocus() {
        this.relateSearchOpen = true;
    }

    private setRelated(related) {
        this.model.data[this.relateIdField] = related.id;
        this.model.data[this.relateNameField] = related.text;
        this.closePopups();
    }

    private goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }


    private openSearchModal() {
        // close the relate search
        this.relateSearchOpen = false;

        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if(items.length > 0) {
                    this.model.data[this.relateIdField] = items[0].id;
                    this.model.data[this.relateNameField] = items[0].summary_text;
                }
            });
        });
    }
}

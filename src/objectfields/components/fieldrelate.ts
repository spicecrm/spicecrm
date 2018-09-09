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
    templateUrl: './app/objectfields/templates/fieldrelate.html',
    providers: [popup],
    host: {
        // '(document:click)' : 'this.onClick($event)'
    }
})
export class fieldRelate extends fieldGeneric implements OnInit
{
    relateIdField: string = '';
    relateNameField: string = '';
    relateType: string = '';
    relateSearchOpen: boolean = false;
    relateSearchTerm: string = '';

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

    ngOnInit() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    closePopups()
    {
        if (this.model.data[this.relateIdField])
            this.relateSearchTerm = '';

        this.relateSearchOpen = false;

    }

    clearField() {
        //this.model.data[this.relateIdField] = '';
        this.model.data[this.relateNameField] = '';
        this.model.setField(this.relateIdField, '');
    }

    onFocus() {
        this.relateSearchOpen = true;
    }

    setRelated(related){
        this.model.data[this.relateIdField] = related.id;
        this.model.data[this.relateNameField] = related.text;
        this.closePopups();
    }

    goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.data[this.relateIdField]]);
    }


    openSearchModal(){
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
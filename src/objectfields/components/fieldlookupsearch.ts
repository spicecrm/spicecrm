import {Component, ElementRef, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'field-lookup-search',
    templateUrl: './app/objectfields/templates/fieldlookupsearch.html'
})
export class fieldLookupSearch {
    searchTerm: string = '';
    searchTimeout: any = {};
    @Input() module: string = '';
    @Input() fieldid: string = '';

    @Output() selectedObject: EventEmitter<any> = new EventEmitter<any>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) window.clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    };

    @Output() searchtermChange = new EventEmitter<string>();
    recentItems: Array<any> = [];

    constructor(private metadata: metadata, public model: model, public popup: popup, public fts: fts, public language: language, private modal: modal) {
    }

    get canAdd(){
        return this.metadata.checkModuleAcl(this.module, 'edit');
    }

    doSearch() {
        if (this.searchTerm !== '' && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.fts.searchByModules(this.searchTerm, [this.module]);

        }
    }

    setParent(id, text, data) {
        this.searchTerm = '';
        this.searchtermChange.emit(this.searchTerm);

        this.selectedObject.emit({'id':id, 'text': text, 'data': data});

        this.popup.close();
    }

    getSearchResults() {
        let resultsArray: Array<any> = [];
        this.fts.moduleSearchresults.some(results => {
            if (results.module === this.module) {
                resultsArray = results.data.hits;
                return true;
            }
        })
        return resultsArray;
    }

    addParent() {

    }

    openModal(){
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.module;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
               //  this.addSelectedItems(items);
                this.selectedObject.emit({ 'id':items[0].id, 'text': items[0].summary_text, 'data': items[0] });
            });
            selectModal.instance.searchTerm = this.searchTerm;
        });
    }
}
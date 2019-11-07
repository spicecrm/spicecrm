/**
 * @module ObjectFields
 */
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'field-lookup-search',
    templateUrl: './src/objectfields/templates/fieldlookupsearch.html'
})
export class fieldLookupSearch {
    private searchTerm: string = '';
    private searchTimeout: any = {};
    @Input() private module: string = '';
    @Input() private fieldid: string = '';
    @Input() private modulefilter: string = '';
    @Input() private disableadd: boolean = false;

    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();
    @Output() private searchWithModal = new EventEmitter();

    @Output() private searchtermChange = new EventEmitter<string>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {window.clearTimeout(this.searchTimeout);}
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    }

    constructor( private metadata: metadata, public model: model, public fts: fts, public language: language, private modal: modal ) {
    }

    get canAdd() {
        return !this.disableadd && this.metadata.checkModuleAcl(this.module, 'edit');
    }

    private doSearch() {
        if (this.searchTerm !== '' && this.searchTerm !== this.fts.searchTerm) {
            this.fts.searchByModules({searchterm: this.searchTerm, modules: [this.module],modulefilter: this.modulefilter});
        }
    }

    private setParent(id, text, data) {
        this.searchTerm = '';
        this.searchtermChange.emit(this.searchTerm);

        this.selectedObject.emit({ id, text, data });
    }

    private recordAdded( record ) {
        this.setParent( record.id, record.text, record.data );
    }

    private getSearchResults() {
        let resultsArray = [];
        this.fts.moduleSearchresults.some(results => {
            if (results.module === this.module) {
                resultsArray = results.data.hits;
                return true;
            }
        });
        return resultsArray;
    }

}

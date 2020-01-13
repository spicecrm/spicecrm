/**
 * @module ObjectFields
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';

/**
 * renders the lookup search dropdown
 */
@Component({
    selector: 'field-lookup-search',
    templateUrl: './src/objectfields/templates/fieldlookupsearch.html',
    providers: [modellist]
})
export class fieldLookupSearch implements OnInit {
    /**
     * the searchterm entered
     */
    private searchTerm: string = '';

    /**
     * a timeout to have a delay when typing until the search starts
     */
    private searchTimeout: any = {};

    /**
     * the module we are searching for
     */
    @Input() private module: string = '';

    /**
     * an optional mddulefilter to be appilied to the searches
     */
    @Input() private modulefilter: string = '';

    /**
     * set to disable the add functionality by the config
     */
    @Input() private disableadd: boolean = false;

    /**
     * an emitter if an object has been selected
     */
    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emit to open the modal for the search
     */
    @Output() private searchWithModal = new EventEmitter();

    /**
     * emits when the searchterm has been changed
     */
    @Output() private searchtermChange = new EventEmitter<string>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {
            window.clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    }

    constructor(private metadata: metadata, public model: model, public modellist: modellist, public language: language, private modal: modal) {
    }

    /**
     * initialize the modellist service
     */
    public ngOnInit() {
        this.modellist.module = this.module;
        this.modellist.modulefilter = this.modulefilter;
        this.modellist.loadlimit = 5;
    }

    /**
     * simple getter to check if add is enabled and the user has create rights on the module
     */
    get canAdd() {
        return !this.disableadd && this.metadata.checkModuleAcl(this.module, 'edit');
    }

    /**
     * run the search
     */
    private doSearch() {
        if (this.searchTerm !== '' && this.searchTerm !== this.modellist.searchTerm) {
            this.modellist.searchTerm = this.searchTerm;
            this.modellist.getListData();
        }
    }

    /**
     * sets the item
     *
     * @param data the data of the selected model
     */
    private setItem(data: any) {
        // reset and emit the empty searchterm
        this.searchTerm = '';
        this.searchtermChange.emit(this.searchTerm);

        // emit the selected Object
        this.selectedObject.emit({id: data.id, text: data.summary_text, data});
    }

    /**
     * when a record has been added
     *
     * @param record the created record
     */
    private recordAdded(record) {
        this.setItem(record.data);
    }


}

/**
 * @module ObjectFields
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
    Renderer2,
    OnDestroy
} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {relateFilter} from "../../services/interfaces.service";
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {Subscription} from "rxjs";

/**
 * renders the lookup search dropdown
 */
@Component({
    selector: 'field-lookup-search',
    templateUrl: '../templates/fieldlookupsearch.html',
    providers: [modellist]
})
export class fieldLookupSearch implements OnInit, OnChanges, OnDestroy {
    /**
     * the searchterm entered
     */
    public searchTerm: string = '';

    /**
     * a timeout to have a delay when typing until the search starts
     */
    public searchTimeout: any = {};

    /**
     * input element from template
     */
    @Input() public inputElement;

    private listener: any;

    /**
     * selected item for keyboard navigation
     */
    public selectedItem:{id: string, summary_text: string};
    /**
     * the module we are searching for
     */
    @Input() public module: string = '';

    /**
     * an optional mddulefilter to be appilied to the searches
     */
    @Input() public modulefilter: string = '';

    /**
     * set to disable the add functionality by the config
     */
    @Input() public disableadd: boolean = false;

    /**
     * a relate filter for the modellist
     */
    @Input() public relatefilter: relateFilter;

    /**
     * additonal input for the id of the relate filter so the onChange can detect and trigger a reload
     */
    @Input() public relateId: string;

    /**
     * an emitter if an object has been selected
     */
    @Output() public selectedObject: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emit to open the modal for the search
     */
    @Output() public searchWithModal = new EventEmitter();

    /**
     * emits when the searchterm has been changed
     */
    @Output() public searchtermChange = new EventEmitter<string>();

    /**
     * holds the various subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {
            window.clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    }

    constructor(public metadata: metadata, public model: model, public modellist: modellist, public language: language, public modal: modal, public renderer: Renderer2,) {
    }

    /**
     * initialize the modellist service
     */
    public ngOnInit() {
        // set th efilters
        this.modellist.modulefilter = this.modulefilter;
        if (this.relatefilter) {
            this.modellist.relatefilter = this.relatefilter;
        }

        this.modellist.loadlimit = 5;

        // set the module
        this.modellist.initialize(this.module);

        this.modellist.getListData();

       // event listener for keyboard events
        if (this.inputElement) {
            this.listener = this.renderer.listen(this.inputElement, 'keyup', (e: KeyboardEvent) => {
                const index = this.modellist.listData.list.findIndex(i => i == this.selectedItem);
                switch (e.key) {
                    case 'Enter':
                        if(this.modellist.listData.list.length == 1) this.selectedItem = this.modellist.listData.list[0];
                        this.selectedObject.emit({
                            id: this.selectedItem.id,
                            text: this.selectedItem.summary_text,
                            data: this.selectedItem
                        });
                        break;
                    case 'ArrowDown':
                        this.selectedItem = this.modellist.listData.list[index + 1 >= this.modellist.listData.list.length ? 0 : index + 1];
                        break;
                    case 'ArrowUp':
                        this.selectedItem = this.modellist.listData.list[index - 1 < 0 ? this.modellist.listData.list.length - 1 : index - 1];
                        break;
                    case 'Escape':
                        this.selectedItem = {id: '', summary_text: ''};
                        break;
                }
            });
        }
    }

    /**
     * react to changes of the relatedId
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.relateId && !!this.modellist.currentList) {
            this.modellist.getListData();
        }
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
    public doSearch() {
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
    public setItem(data: any) {
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
    public recordAdded(record) {
        this.setItem(record.data);
    }

    /**
     * unlisten
     */
    public ngOnDestroy() {
        if (this.listener) {
            this.listener()
        }
    }

}

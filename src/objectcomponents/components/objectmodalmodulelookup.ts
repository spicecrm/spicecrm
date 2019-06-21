/**
 * @module ObjectComponents
 */
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, model, modellist],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
        '::ng-deep field-generic-display > div { padding-left: 0 !important; padding-right: 0 !important; }'
    ]
})
export class ObjectModalModuleLookup implements OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: false}) private tablecontent: ViewContainerRef;
    @ViewChild('modalcontent', {read: ViewContainerRef, static: false}) private modalcontent: ViewContainerRef;

    public displayFields: any[] = [];
    public listFields: string[] = [];
    public allSelected: boolean = false;
    public searchTerm: string = '';
    public searchTermOld: string = '';
    public searchTimeOut: any = undefined;
    public self: any = {};
    public multiselect: boolean = false;
    public module: string = '';
    public modulefilter: string = '';

    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language, private model: model, private modellist: modellist, private metadata: metadata) {
    }


    get checkbox() {
        return this.allSelected
    }

    set checkbox(value) {
        this.allSelected = value;
        if (value) {
            this.modellist.setAllSelected();
        } else {
            this.modellist.setAllUnselected();
        }
    }

    private contentStyle() {
        let contentRect = this.tablecontent.element.nativeElement.getBoundingClientRect();
        let modalRect = this.modalcontent.element.nativeElement.getBoundingClientRect();

        return {
            height: modalRect.height - (contentRect.top - modalRect.top)
        };
    }

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.module);
        this.displayFields = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.model.module = this.module;
        this.modellist.setModule(this.module);
        this.modellist.modulefilter = this.modulefilter;

        for (let displayField of this.displayFields) {
            this.listFields.push(displayField.field);
        }

        // load the list
        this.modellist.getListData(this.listFields);

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        }
    }

    private doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.listFields);
    }

    private triggerSearch(_e) {
        if (this.searchTerm === this.searchTermOld) return;
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if (this.searchTerm.length > 0) {
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                    this.doSearch();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    private closePopup() {
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    private getSelectedCount() {
        return this.modellist.getSelectedCount();
    }

    private selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    private clickRow(event, item) {
        this.selectedItems.emit([item]);
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    private onModalEscX() {
        this.closePopup();
    }

}
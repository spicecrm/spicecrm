/**
 * @module ObjectComponents
 */
import {
    Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';


/**
 * this component provides a search for a given module, using beans/db!
 * this modal component provides a search for a given module, using beans/db!
 */
@Component({
    selector: 'object-modal-module-db-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist]
})
export class ObjectModalModuleDBLookup implements OnInit {

    /**
     * the table contnet .. reqwuired to asses the scrolling
     * ToDo: change to fixed header
     */
    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;

    /**
     * the modal content
     */
    @ViewChild('modalcontent', {read: ViewContainerRef, static: true}) private modalcontent: ViewContainerRef;

    /**
     * the list of fields to be displayed
     */
    public displayFields: any[] = [];
    public listFields: string[] = [];
    public allSelected: boolean = false;

    /**
     * the searchterm
     */
    public searchTerm: string = '';

    /**
     * a timeout function to ensure searching sztarts after a time there has been no input
     */
    public searchTimeOut: any = undefined;

    /**
     * refgerence to self as we are a modal
     */
    public self: any = {};
    public multiselect: boolean = false;
    public module: string = '';
    @Output() public selectedItems: EventEmitter<any> = new EventEmitter<any>();
    public searchConditions = [];

    constructor(
        private language: language,
        private modellist: modellist,
        private metadata: metadata
    ) {

    }


    get checkbox() {
        return this.allSelected;
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

        this.modellist.setModule(this.module);

        if (!this.searchConditions && componentconfig.searchconditions) {
            this.searchConditions = JSON.parse(componentconfig.searchconditions);
        }
        this.modellist.searchConditions = this.searchConditions;

        for (let displayField of this.displayFields) {
            this.listFields.push(displayField.field);
        }

        this.doSearch();
    }

    private doSearch() {
        this.modellist.searchConditions = this.searchConditions;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.loadFilteredList(this.listFields);
    }

    private triggerSearch(_e) {
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
            this.modellist.loadMoreFilteredList();
        }
    }

    private closePopup() {
        this.self.destroy();
        event.preventDefault();
    }

    private getSelectedCount() {
        return this.modellist.getSelectedCount();
    }

    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.self.destroy();
    }

    public clickRow(event, item) {
        if (!this.multiselect) {
            this.selectedItems.emit([item]);
            this.self.destroy();
        }
    }
}
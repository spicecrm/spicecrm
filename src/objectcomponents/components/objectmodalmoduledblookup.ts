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
    providers: [view, model, modellist]
})
export class ObjectModalModuleDBLookup implements OnInit {

    @ViewChild('tablecontent', {read: ViewContainerRef}) tablecontent: ViewContainerRef;
    @ViewChild('modalcontent', {read: ViewContainerRef}) modalcontent: ViewContainerRef;

    displayFields: Array<any> = [];
    listFields: Array<string> = [];
    allSelected: boolean = false;
    searchTerm: string = '';
    searchTimeOut: any = undefined;
    self: any = {};
    multiselect: boolean = false;
    module: string = '';
    @Output() selectedItems: EventEmitter<any> = new EventEmitter<any>();
    searchConditions = [];

    constructor(
        private language: language,
        private model: model,
        private modellist: modellist,
        private metadata: metadata
    ) {

    }


    get checkbox() {
        return this.allSelected
    }

    set checkbox(value) {
        this.allSelected = value;
        if (value)
            this.modellist.setAllSelected();
        else
            this.modellist.setAllUnselected();
    }

    contentStyle(){
        let contentRect = this.tablecontent.element.nativeElement.getBoundingClientRect();
        let modalRect = this.modalcontent.element.nativeElement.getBoundingClientRect();

        return {
            height: modalRect.height - (contentRect.top - modalRect.top)
        }
    }

    ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.module);
        this.displayFields = this.metadata.getFieldSetFields(componentconfig.fieldset);

        this.model.module = this.module;
        this.modellist.setModule(this.module);

        if(!this.searchConditions && componentconfig.searchconditions)
            this.searchConditions = JSON.parse(componentconfig.searchconditions);
        this.modellist.searchConditions = this.searchConditions;

        for (let displayField of this.displayFields) {
            this.listFields.push(displayField.field);
        }

        this.doSearch();
    }

    doSearch()
    {
        this.modellist.searchConditions = this.searchConditions;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.loadFilteredList(this.listFields);
    }

    triggerSearch(_e){
        // handle the key pressed
        switch (_e.key) {
            case 'Enter':
                if(this.searchTerm.length > 0){
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

    onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreFilteredList();
        }
    }

    closePopup(event) {
        this.self.destroy();
        event.preventDefault();
    }

    getSelectedCount() {
        return this.modellist.getSelectedCount();
    }

    selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.self.destroy();
    }

    clickRow(event, item){
        this.selectedItems.emit([item]);
        this.self.destroy();
    }
}
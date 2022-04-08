/**
 * @module ObjectComponents
 */
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef, OnDestroy, Input} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {Subscription} from "rxjs";
import {ObjectModalModuleLookupHeader} from "./objectmodalmodulelookupheader";
import {relateFilter} from "../../services/interfaces.service";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: '../templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
    ]
})
export class ObjectModalModuleLookup implements OnInit, OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) public tablecontent: ViewContainerRef;
    @ViewChild(ObjectModalModuleLookupHeader) public headercontent: ObjectModalModuleLookupHeader;

    /**
     * the search term entered
     */
    public searchTerm: string = '';

    /**
     * referemce to self to allow closing the modal window
     */
    public self: any = {};

    /**
     * set to true to enable multiselect, default to false
     */
    public multiselect: boolean = false;

    /**
     * the mdule for the list
     */
    public module: string = '';

    /**
     * a module filter id to be applied to the search
     */
    public modulefilter: string = '';

    /**
     * a relate filter for the modellist
     */
    @Input() public relatefilter: relateFilter;


    /**
     * a collection of subscriptions to be cancelled once the component is destroyed
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() public selectedItems: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits the used search term
     */
    @Output() public usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout) {
        // subscribe to changes of the listtype
        this.subscriptions.add(this.modellist.listType$.subscribe(newType => this.switchListtype()));
    }

    /**
     * get the style for the content so the table can scroll with fixed header
     */
    public contentStyle() {
        if(this.headercontent) {
            let headerRect = this.headercontent.element.nativeElement.getBoundingClientRect();

            return {
                height: `calc(100% - ${headerRect.height}px)`
            };
        } else {
            return {
                height: `100%`
            };
        }
    }

    /**
     * returns treu if we have a small screen factor
     */
    get smallView() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        // this.model.module = this.module;
        this.modellist.modulefilter = this.modulefilter;
        this.modellist.relatefilter = this.relatefilter;
        this.modellist.useCache = false;
        this.modellist.initialize(this.module);
        this.modellist.getListData();

        // set hte module on the model
        this.model.module = this.module;

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        }
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the change of listtype
     */
    public switchListtype() {
        /**
        if (this.modellist.module) {
            this.modellist.reLoadList();
        }*/
    }

    /**
     * tigger the search
     */
    public doSearch() {
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData();
    }

    /**
     * scroll event handler for the infinite scrolling in the window
     * @param e
     */
    public onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * closes the popup
     */
    public closePopup() {
        this.usedSearchTerm.emit(this.modellist.searchTerm);
        this.self.destroy();
    }


    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    public clickRow(event, item) {
        if (!this.multiselect) {
            this.selectedItems.emit([item]);
            this.usedSearchTerm.emit(this.searchTerm);
            this.self.destroy();
        }
    }
}

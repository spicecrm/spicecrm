/**
 * @module ObjectComponents
 */
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef, OnDestroy, Input} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist, relateFilter} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
    ],
    animations: [
        trigger('animatepanel', [
            transition(':enter', [
                style({right: '-320px', overflow: 'hidden'}),
                animate('.5s', style({right: '0px'})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({right: '-320px'}))
            ])
        ])
    ]
})
export class ObjectModalModuleLookup implements OnInit, OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild('headercontent', {read: ViewContainerRef, static: true}) private headercontent: ViewContainerRef;

    /**
     * the search term entered
     */
    public searchTerm: string = '';

    /**
     * the search term used in the search before
     */
    public searchTermOld: string = '';

    /**
     * a search timeout function to wait until the user stops typing with a certain delay and onyl then start the search
     */
    public searchTimeOut: any = undefined;

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
    @Input() private relatefilter: relateFilter;

    /**
     * a guid to kill the autocomplete
     */
    private autoCompleteKiller: string;

    private subscriptions: Subscription = new Subscription();

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits the used search term
     */
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout) {
        // subscribe to changes of the listtype
        this.subscriptions.add(this.modellist.listtype$.subscribe(newType => this.switchListtype()));

        // set a random id so no autocomplete is triggered on the field
        this.autoCompleteKiller = this.modelutilities.generateGuid();
    }

    /**
     * get the style for the content so the table can scroll with fixed header
     */
    private contentStyle() {
        let headerRect = this.headercontent.element.nativeElement.getBoundingClientRect();

        return {
            height: `calc(100% - ${headerRect.height}px)`
        };
    }

    /**
     * a getter that builds teh request fields from the listfields from the modellistservice
     */
    get requestfields() {
        let requestfields = [];
        for (let listfield of this.modellist.listfields) {
            if (requestfields.indexOf(listfield.field) != -1) {
                requestfields.push(listfield.field);
            }
        }
        return requestfields;
    }


    /**
     * returns the relate filter active flag
     */
    get relatefilterActive() {
        return this.relatefilter?.active;
    }

    /**
     * sets the relate filter active flag and triggers a reload
     *
     * @param value
     */
    set relatefilterActive(value) {
        this.relatefilter.active = value;
        this.modellist.relatefilter.active = value;
        this.modellist.reLoadList();
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
        // this.modellist.setModule(this.module, true);
        this.modellist.module = this.module;

        // set hte module on the model
        this.model.module = this.module;

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        } else {
            this.searchTerm = this.modellist.searchTerm;
            this.searchTermOld = this.modellist.searchTerm;
            // load the list if the view of the cached entry is different
            /*
            if (this.modellist.listData.listcomponent != 'ObjectList') {
                this.modellist.getListData(this.requestfields);
            }
             */
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
    private switchListtype() {
        if (this.modellist.module) {
            this.modellist.reLoadList();
        }
    }

    /**
     * tigger the search
     */
    private doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.requestfields);
    }

    /**
     * trigger the search immediate or with a delay
     *
     * @param _e
     */
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

    /**
     * scroll event handler for the infinite scrolling in the window
     * @param e
     */
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * closes the popup
     */
    private closePopup() {
        this.usedSearchTerm.emit(this.searchTerm);
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

    private onModalEscX() {
        this.closePopup();
    }

    /**
     * a getter for the aggregates
     */
    private getAggregates() {
        let aggArray = [];
        for (let aggregate in this.modellist.searchAggregates) {
            if (aggregate != 'tags' && this.modellist.searchAggregates.hasOwnProperty(aggregate)) {
                aggArray.push(this.modellist.searchAggregates[aggregate]);
            }
        }

        return aggArray;
    }


    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.modellist.setSortField(field.field);
        }
    }
}

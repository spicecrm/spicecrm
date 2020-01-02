/**
 * @module ObjectComponents
 */
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef, OnDestroy} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist],
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

    /**
     * a guid to kill the autocomplete
     */
    private autoCompleteKiller: string;

    private modellistsubscribe: any;

    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities) {
        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.switchListtype());

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
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {

        // this.model.module = this.module;
        this.modellist.module = this.module;
        this.modellist.modulefilter = this.modulefilter;

        for (let displayField of this.displayFields) {
            this.listFields.push(displayField.field);
        }
        // load the display fields
        this.setFieldDefs();

        // load the list
        this.modellist.getListData(this.listFields);

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        }
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        if (this.modellistsubscribe) this.modellistsubscribe.unsubscribe();
    }

    /**
     * handle the change of listtype
     */
    private switchListtype() {
        this.setFieldDefs();
        if (this.modellist.module) {
            this.modellist.reLoadList();
        }
    }

    /**
     * manage the display fields
     */
    private setFieldDefs(): void {
        this.displayFields = [];

        // check if we have fielddefs
        let fielddefs = this.modellist.getFieldDefs();
        // load all fields
        let componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if ((fielddefs.length > 0 && fielddefs.indexOf(listField.field) >= 0) || (fielddefs.length === 0 && listField.fieldconfig.default !== false)) {
                this.displayFields.push(listField);
            }
        }
    }

    /**
     * tigger the search
     */
    private doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.listFields);
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

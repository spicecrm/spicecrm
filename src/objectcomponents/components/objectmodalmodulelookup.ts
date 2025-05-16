/**
 * @module ObjectComponents
 */
import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
    Input,
    SkipSelf
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {Subject, Subscription} from "rxjs";
import {ObjectModalModuleLookupHeader} from "./objectmodalmodulelookupheader";
import {listDataI, relateFilter} from "../../services/interfaces.service";
import {indexOf} from "underscore";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: '../templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model]
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
     * store component config
     */
    public componentConfig: any = {};

    /**
     * set to true to enable multiselect, default to false
     */
    public multiselect: boolean = false;

    /**
     * holds the saved selected items
     *
     * @private
     */
    private savedSelectedItems: any[] = [];

    /**
     * a boolean to toggle if the regular list or the selected items are shown
     */
    public showSelected: boolean = false;

    /**
     * a backup of the listdata for the toggle
     * in case the saved selected are shown the listdata is backup and then written back to the service when toggled back
     */
    public listDataBackup: listDataI;

    /**
     * the mdule for the list
     */
    public module: string = '';

    /**
     * a module filter id to be applied to the search
     */
    public modulefilter: string = '';

    /**
     * an optional bean for modulefilter (parent-bean over the list)
     * is given to the custom filter methods
     */
    public filtercontext: { id?: string, module: string, data?: any };

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
     * emit when modal closed
     */
    public onClose = new Subject<void>();

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
        if (this.headercontent) {
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
        this.modellist.filtercontext = this.filtercontext;
        this.modellist.useCache = false;
        this.modellist.initialize(this.module);
        this.modellist.getListData();

        // get component config for add button
        this.componentConfig = this.metadata.getComponentConfig('ObjectModalModuleLookup', this.module);

        // set hte module on the model
        this.model.module = this.module;

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        }

        // in case of multiselect allow saved selection
        if(this.multiselect){
            this.subscriptions.add(this.modellist.selectionChanged$.subscribe({
                next: (s) => {
                    this.listSelectionChanged(s);
                }
            }));

            this.subscriptions.add(this.modellist.listDataChanged$.subscribe({
                next: (s) => {
                    this.listDataChanged();
                }
            }));
        }
    }


    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();

        // write the backup data back to the listservice
        if(this.listDataBackup){
            this.modellist.listData = this.listDataBackup;
        }
    }

    /**
     * handles the list selection change
     *
     * @param event
     * @private
     */
    private listSelectionChanged(event){
        let currentSelectedItems = this.modellist.getSelectedItems();
        if(typeof event === 'string'){
            if(currentSelectedItems.findIndex(i => i.id == event) == -1 && this.savedSelectedItems.findIndex(i => i.id == event) >= 0){
                this.savedSelectedItems.splice(this.savedSelectedItems.findIndex(i => i.id == event), 1);
            } else if (currentSelectedItems.findIndex(i => i.id == event) >= 0 && this.savedSelectedItems.findIndex(i => i.id == event) == -1){
                this.savedSelectedItems.push(JSON.parse(JSON.stringify(currentSelectedItems.find(i => i.id == event))));
            }
        }
    }

    /**
     * handles the list data change
     * @private
     */
    private listDataChanged(){
        if(!this.showSelected) {
            if (this.savedSelectedItems.length > 0) {
                this.modellist.listData.list.filter(i => this.savedSelectedItems.findIndex(si => si.id == i.id) >= 0).forEach(i => i.selected = true);
            }
        }
    }

    get selectedCount(){
        return this.savedSelectedItems.filter(s => s.selected).length;
    }

    public toggleShowSelected(){
        this.showSelected = !this.showSelected;

        if(this.showSelected){
            this.listDataBackup = JSON.parse(JSON.stringify(this.modellist.listData));
            this.modellist.listData = {
                list: JSON.parse(JSON.stringify(this.savedSelectedItems)),
                totalcount: this.savedSelectedItems.length
            };
        } else {
            // this.savedSelectedItems = JSON.parse(JSON.stringify(this.modellist.getSelectedItems()));
            this.modellist.listData = JSON.parse(JSON.stringify(this.listDataBackup));
            this.listDataBackup = undefined;

            // check if all are still selected and unselect all no longer selected
            this.modellist.listData.list.filter(i => i.selected).forEach(i => {
                if(this.savedSelectedItems.findIndex(si => si.id == i.id) == -1) i.selected = false;
            })
        }
    }

    /**
     *
     */
    get canAdd() {
        return this.metadata.checkModuleAcl(this.model.module, 'create');
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
        this.onClose.next();
        this.onClose.complete();
        this.self.destroy();
    }

    public createNew() {
        // make sure we have no idea so a new on gets issues
        this.model.initialize();
        this.model.addModel('', null, {}, true).subscribe({
            next: (item) => {
                this.selectedItems.emit([item]);
                this.usedSearchTerm.emit(this.searchTerm);
                this.self.destroy();
            }
        });
    }


    public selectItems() {
        this.selectedItems.emit(this.savedSelectedItems.filter(s => s.selected));
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

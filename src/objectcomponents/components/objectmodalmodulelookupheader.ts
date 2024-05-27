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
    ElementRef
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";
import {configurationService} from "../../services/configuration.service";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup-header',
    templateUrl: '../templates/objectmodalmodulelookupheader.html',
})
export class ObjectModalModuleLookupHeader {

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
     * a guid to kill the autocomplete
     */
    public autoCompleteKiller: string;

    public subscriptions: Subscription = new Subscription();

    /**
     * the original module filter passed through
     */
    public moduleFilter: string = '';

    /**
     * the name of the module filter passed through
     */
    public moduleFilterName: string = '';

    /**
     * emits the used search term
     */
    @Output() public usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public modelutilities: modelutilities, public metadata: metadata, public element: ElementRef, public configuration: configurationService) {

        // set a random id so no autocomplete is triggered on the field
        this.autoCompleteKiller = this.modelutilities.generateGuid();
    }

    get modulefilter() {
        return this.modellist.modulefilter;
    }

    get modulefilterActive() {
        return (this.modellist.modulefilter ? true : false);
    }

    /**
     * sets the module filter active flag and triggers a reload
     *
     * @param value
     */
    set modulefilterActive(value) {
        if(!value) {
            this.moduleFilter = this.modellist.modulefilter;
            this.modellist.modulefilter = '';
        }
        else this.modellist.modulefilter = this.moduleFilter;

        this.modellist.reLoadList();
    }

    get relatefilter() {
        return this.modellist.relatefilter;
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
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        this.searchTerm = this.modellist.searchTerm;
        this.searchTermOld = this.modellist.searchTerm;
        this.getModuleFilterName();
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * tigger the search
     */
    public doSearch() {
        this.searchTermOld = this.searchTerm;
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData();
    }

    /**
     * trigger the search immediate or with a delay
     *
     * @param _e
     */
    public triggerSearch(_e) {
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
     * retrieves the fiter name for display in the header
     */
    public getModuleFilterName() {
        if(this.modellist.modulefilter){
            let moduleFilters = this.configuration.getData('modulefilters');
            this.moduleFilterName = moduleFilters[this.modellist.modulefilter].name;
        }
    }
}

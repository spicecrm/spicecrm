/**
 * @module ModuleSpiceMap
 */
import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {modellist} from "../../../services/modellist.service";
import {Subscription} from "rxjs";

/**
 * renders list header with search and other list functionalities.
 */
@Component({
    selector: 'spice-google-maps-list-header',
    templateUrl: '../templates/spicegooglemapslistheader.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceGoogleMapsListHeader implements OnInit, OnDestroy {
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


    public subscriptions: Subscription = new Subscription();

    /**
     * emits the used search term
     */
    @Output() public usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public element: ElementRef) {
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

    get relateFilter() {
        return this.modellist.relatefilter;
    }

    /**
     * returns the relate filter active flag
     */
    get relateFilterActive() {
        return this.relateFilter?.active;
    }

    /**
     * sets the relate filter active flag and triggers a reload
     *
     * @param value
     */
    set relateFilterActive(value) {
        this.relateFilter.active = value;
        this.modellist.relatefilter.active = value;
        this.modellist.reLoadList();
    }


    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        this.searchTerm = this.modellist.searchTerm;
        this.searchTermOld = this.modellist.searchTerm;
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
}

/**
 * @module ObjectComponents
 */
import {Component,ElementRef, OnDestroy, Renderer2} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {Subscription} from "rxjs";
import {ObjectListFilterI} from "../interfaces/objectcomponents.interfaces";
import {modal} from "../../services/modal.service";

declare var _: any;

/**
 * renders the filter panel for the list view
 */
@Component({
    selector: 'object-listview-filter-panel',
    templateUrl: '../templates/objectlistviewfilterpanel.html',
    host: {
        class: 'slds-is-fixed'
    }
})
export class ObjectListViewFilterPanel implements OnDestroy {

    /**
     * the default filter object
     */
    public filter: ObjectListFilterI = {
        logicaloperator: 'and',
        groupscope: 'all',
        geography: {},
        conditions: []
    };

    public subcriptions: Subscription = new Subscription();

    constructor(public elementRef: ElementRef,
                public language: language,
                public metadata: metadata,
                public modellist: modellist,
                public model: model,
                public renderer: Renderer2,
                private modal: modal) {
        // subscribe to the list type selected to handle the filters set by the listtype
        this.subcriptions.add(
            this.modellist.listType$.subscribe(newList => {
                this.setFilter();
            })
        );
    }

    public ngOnDestroy() {
        this.subcriptions.unsubscribe();
    }

    /**
     * resets the filter data when the list is changed
     */
    public setFilter() {
        // create a shallow copy of the filter and use locally
        this.filter = {...this.modellist.getFilterDefs()};

        // if no filter is set ... set it clean and empty
        if (!this.filter || _.isEmpty(this.filter)) {
            if(this.modellist.hasInactiveFieldProperty) {
                this.filter = {
                    logicaloperator: 'and',
                    groupscope: 'all',
                    groupstate: 'active',
                    geography: {},
                    conditions: []
                };
            } else {
                this.filter = {
                    logicaloperator: 'and',
                    groupscope: 'all',
                    geography: {},
                    conditions: []
                };
            }
        }
    }

    /**
     * simple getter and setter for the geography
     */
    get geography() {
        return this.filter.geography ? this.filter.geography : {};
    }

    /**
     * simple setter for the geography
     *
     * @param geography
     */
    set geography(geography) {
        this.filter.geography = geography;
    }

    /**
     * checks if the filter objects has been changed
     */
    get isChanged() {
        return !_.isEqual(this.filter, this.modellist.getFilterDefs());
    }

    /**
     * checks if the user is allowed to edit
     */
    get canEdit() {
        return this.modellist.checkAccess('edit');
    }

    /**
     * saves the filter
     */
    public save() {
        const loadingModal = this.modal.await('LBL_SAVING_FILTER');

        if (this.isChanged) {
            this.modellist.updateListType({
                filterdefs: JSON.stringify(this.filter)
            }).subscribe(() => {
                loadingModal.emit();
                loadingModal.complete();
                this.modellist.cancelPendingRequests = false;
                this.modellist.reLoadList();
            });

            // close the filter panel
            this.modellist.displayFilters = false;
        }
    }

    /**
     * cancels the edit and resets the filöter to the current defined one
     */
    public cancel() {
        this.filter = {...this.modellist.getFilterDefs()};

        // close the filter panel
        this.modellist.displayFilters = false;
    }

    /**
     * remove all Filters
     */
    public removeAllFilters() {
        this.filter.conditions = [];
    }

    /**
     * adds a new filter expression
     */
    public addExpression(e) {
        e.preventDefault();
        e.stopPropagation();
        let expression = {
            field: '',
            operator: '',
            filtervalue: ''
        };
        this.filter.conditions.push(expression);
    }

    /**
     * delete a filter item
     *
     * @param index index of the filter item
     */
    public deleteItem(index) {
        this.filter.conditions.splice(index, 1);
    }

}

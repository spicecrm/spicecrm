/**
 * @module ModuleActivities
 */
import {
    Component, Renderer2, ElementRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {activitiytimeline, activityTimelineOwnerfilter} from '../../../services/activitiytimeline.service';

/**
 * a filter button that is tied to the timeline service and allows the user to filter by type and assignment
 */
@Component({
    selector: 'activity-timeline-filter',
    templateUrl: '../templates/activitytimelinefilter.html'
})
export class ActivityTimelineFilter {

    /**
     * internal fag if the dropdown is open
     */
    public isOpen: boolean = false;

    /**
     * @ignore
     *
     * internal listener for the click outsife of the div
     */
    public clickListener: any;

    /**
     * internal array with the types and the names
     */
    public activityTypes: any[] = [];

    /**
     * the filters set for the objects
     */
    public objectfilters: any[] = [];

    /**
     * the owner filter set
     */
    public ownerfilter: activityTimelineOwnerfilter = '';

    constructor(public renderer: Renderer2, public elementRef: ElementRef, public language: language, public metadata: metadata, public activitiytimeline: activitiytimeline) {
        this.setFromService();
    }

    /**
     * get teh values from the service
     */
    public setFromService() {
        this.objectfilters = JSON.parse(JSON.stringify(this.activitiytimeline.filters.objectfilters));
        this.ownerfilter = this.activitiytimeline.filters.own;
    }

    /**
     * set the values to the service
     */
    public setToService() {
        this.activitiytimeline.filters.objectfilters = JSON.parse(JSON.stringify(this.objectfilters));
        this.activitiytimeline.filters.own = this.ownerfilter;

        this.activitiytimeline.reload();
    }

    /**
     * @ignore
     *
     * helper to toggle the dropdown open or closed
     */
    public toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }

        if (this.isOpen) {
            this.buildTypes();
        }
    }

    /**
     * @ignore
     *
     * catched the click event and checks if in the div
     *
     * @param event
     */
    public onClick(event: MouseEvent): void {


        // regitser the click listener
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    /**
     * builds the types
     */
    public buildTypes() {
        this.activityTypes = [];

        for (let activityObject of this.activitiytimeline.filterObjects) {
            this.activityTypes.push({
                type: activityObject,
                name: this.language.getModuleName(activityObject)
            });
        }

        this.activityTypes.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    /**
     * set the class for the filter properly to indicate if a filter is set and active
     */
    get filterColorClass() {
        return this.activitiytimeline.filters.objectfilters.length > 0 || this.activitiytimeline.filters.own ? 'slds-icon-text-error' : 'slds-icon-text-default';
    }

    /**
     * sets the filter
     *
     * @param event
     * @param filter
     */
    public setFilter(event, filter) {
        event.preventDefault();
        if (filter == 'all') {
            this.objectfilters = [];
        } else {
            let index = this.objectfilters.indexOf(filter);
            if (index >= 0) {
                this.objectfilters.splice(index, 1);
            } else {
                this.objectfilters.push(filter);
            }
        }
    }

    /**
     * @ignore
     *
     * a getter for the checkboxes
     *
     * @param filter the filter
     */
    public getChecked(filter) {
        if (filter == 'all') {
            return this.objectfilters.length == 0 ? true : false;
        } else {
            return this.objectfilters.indexOf(filter) >= 0 ? true : false;
        }
    }

    /**
     * @ignore
     *
     * a helper function to close the popup
     *
     * @param apply if set to true the values are set to the service
     */
    public closeDialog(apply) {
        if (this.clickListener) this.clickListener();

        if (apply) {
            this.setToService();
        } else {
            this.setFromService();
        }

        this.isOpen = false;
    }

}

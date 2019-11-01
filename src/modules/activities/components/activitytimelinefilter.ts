/**
 * @module ObjectComponents
 */
import {
    Component, Renderer2, ElementRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {activitiyTimeLineService, activityTimelineOwnerfilter} from '../../../services/activitiytimeline.service';

/**
 * a filter button that is tied to the timeline service and allows the user to filter by type and assignment
 */
@Component({
    selector: 'activity-timeline-filter',
    templateUrl: './src/modules/activities/templates/activitytimelinefilter.html'
})
export class ActivityTimelineFilter {

    /**
     * internal fag if the dropdown is open
     */
    private isOpen: boolean = false;

    /**
     * @ignore
     *
     * internal listener for the click outsife of the div
     */
    private clickListener: any;

    /**
     * internal array with the types and the names
     */
    private activityTypes: any[] = [];

    /**
     * the filters set for the objects
     */
    private objectfilters: any[] = [];

    /**
     * the owner filter set
     */
    private ownerfilter: activityTimelineOwnerfilter = '';

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private language: language, private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService) {
        this.setFromService();
    }

    /**
     * get teh values from the service
     */
    private setFromService() {
        this.objectfilters = JSON.parse(JSON.stringify(this.activitiyTimeLineService.filters.objectfilters));
        this.ownerfilter = this.activitiyTimeLineService.filters.own;
    }

    /**
     * set the values to the service
     */
    private setToService() {
        this.activitiyTimeLineService.filters.objectfilters = JSON.parse(JSON.stringify(this.objectfilters));
        this.activitiyTimeLineService.filters.own = this.ownerfilter;

        this.activitiyTimeLineService.reload();
    }

    /**
     * @ignore
     *
     * helper to toggle the dropdown open or closed
     */
    private toggleOpen() {
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
    private buildTypes() {
        this.activityTypes = [];

        for (let activityObject of this.activitiyTimeLineService.filterObjects) {
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
        return this.activitiyTimeLineService.filters.objectfilters.length > 0 || this.activitiyTimeLineService.filters.own ? 'slds-icon-text-error' : 'slds-icon-text-default';
    }

    /**
     * sets the filter
     *
     * @param event
     * @param filter
     */
    private setFilter(event, filter) {
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
    private getChecked(filter) {
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
    private closeDialog(apply) {
        if (this.clickListener) this.clickListener();

        if (apply) {
            this.setToService();
        } else {
            this.setFromService();
        }

        this.isOpen = false;
    }

}
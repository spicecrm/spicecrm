/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {timeline} from "../../services/timeline.service";

/**
 * a filter button that is tied to the timeline service and allows the user to filter by type and assignment
 */
@Component({
    selector: 'object-timeline-filter',
    templateUrl: '../templates/objecttimelinefilter.html'
})
export class ObjectTimelineFilter {

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
    public moduleTypes: any[] = [];

    /**
     * the filters set for the objects
     */
    public objectfilters: string[] = [];

    public ownerfilter;

    public onlyAuditObjects = false;


    constructor(public renderer: Renderer2, public elementRef: ElementRef, public language: language,
                public metadata: metadata, public timeline: timeline) {
        this.setFromService();
    }

    /**
     * set the class for the filter properly to indicate if a filter is set and active
     */
    get filterColorClass() {
        return (this.timeline.filters.objectfilters.indexOf('Modules') >= 0 && this.timeline.filters.objectfilters.indexOf('auditLog') >= 0 && !this.timeline.filters.own) ? 'slds-icon-text-default' : 'slds-icon-text-error';
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
     * get teh values from the service
     */
    public setFromService() {
        this.objectfilters = JSON.parse(JSON.stringify(this.timeline.filters.objectfilters));
        this.ownerfilter = this.timeline.filters.own;
    }

    /**
     * set the values to the service
     */
    public setToService() {
        this.timeline.filters.objectfilters = JSON.parse(JSON.stringify(this.objectfilters));
        this.timeline.filters.own = this.ownerfilter;
        this.timeline.onlyAudits = this.onlyAuditObjects;

        this.timeline.reload();
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
            this.moduleTypes = this.timeline.timelineModules;
        }
    }

    /**
     * sets the filter
     *
     * @param event
     * @param filter
     */
    public setFilter(event, filter) {
        event.preventDefault();
        if (filter == 'Modules') {
            let index = this.objectfilters.indexOf(filter);
            if (index >= 0) {
                if (this.objectfilters.length <= 1) return;
                this.objectfilters.splice(index, 1);
            } else {
                this.objectfilters = (this.objectfilters.indexOf('auditLog') >= 0) ? ['auditLog', 'Modules'] : ['Modules'];
            }

        } else if (filter == 'auditLog') {
            let index = this.objectfilters.indexOf(filter);
            if (index >= 0) {
                if (this.objectfilters.length <= 1) return;
                this.objectfilters.splice(index, 1);
            } else {
                this.objectfilters.push(filter);
            }
        } else {
            if (this.objectfilters.indexOf('Modules') >= 0) this.objectfilters.splice(this.objectfilters.indexOf('Modules'), 1);
            let index = this.objectfilters.indexOf(filter);
            if (index >= 0) {
                if (this.objectfilters.length <= 1) return;
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
        if (filter == 'Modules') {
            return (this.objectfilters.length === 1 && this.objectfilters.indexOf('Modules') >= 0 || (this.objectfilters.length === 2 && this.objectfilters.indexOf('Modules') >= 0 && this.objectfilters.indexOf('auditLog') >= 0));
        } else if (filter == 'auditLog') {
            return this.objectfilters.indexOf('auditLog') >= 0;
        } else {
            return this.objectfilters.indexOf(filter) >= 0;
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

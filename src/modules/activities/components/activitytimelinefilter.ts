/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private language: language, private metadata: metadata, private activitiytimeline: activitiytimeline) {
        this.setFromService();
    }

    /**
     * get teh values from the service
     */
    private setFromService() {
        this.objectfilters = JSON.parse(JSON.stringify(this.activitiytimeline.filters.objectfilters));
        this.ownerfilter = this.activitiytimeline.filters.own;
    }

    /**
     * set the values to the service
     */
    private setToService() {
        this.activitiytimeline.filters.objectfilters = JSON.parse(JSON.stringify(this.objectfilters));
        this.activitiytimeline.filters.own = this.ownerfilter;

        this.activitiytimeline.reload();
    }

    /**
     * @ignore
     *
     * helper to toggle the dropdown open or closed
     */
    private toggleOpen(e: MouseEvent) {
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
    private buildTypes() {
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

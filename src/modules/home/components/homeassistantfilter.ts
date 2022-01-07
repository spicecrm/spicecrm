/**
 * @module ModuleHome
 */
import {Component, Renderer2, ElementRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {assistant} from '../../../services/assistant.service';

@Component({
    selector: 'home-assistant-filter',
    templateUrl: '../templates/homeassistantfilter.html'
})
export class HomeAssistantFilter {

    public isOpen: boolean = false;
    public clickListener: any;

    constructor(public renderer: Renderer2, public elementRef: ElementRef, public language: language, public metadata: metadata, public assistant: assistant) {

    }

    get activityTypes() {
        return this.assistant.activityTypes;
    }


    public toggleOpen(e: MouseEvent) {
        // stop the event propagation
        e.stopPropagation();

        // open the filter
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {

        // regitser the click listener
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isOpen = false;
            this.clickListener();
        }
    }

    get filterColorClass() {
        return this.assistant.assistantFilters.objectfilters.length > 0 || this.assistant.assistantFilters.timefilter != 'all' ? 'slds-icon-text-error' : 'slds-icon-text-default';
    }

    /**
     * sets the filter
     *
     * @param filter
     * @param e
     * @private
     */
    public setFilter(filter, e) {
        if (filter == 'all') {
            this.assistant.assistantFilters.objectfilters = [];
        } else {
            if(!e) {
                let index = this.assistant.assistantFilters.objectfilters.indexOf(filter);
                this.assistant.assistantFilters.objectfilters.splice(index, 1);
            } else {
                this.assistant.assistantFilters.objectfilters.push(filter);
            }
        }
    }

    /**
     * returns if a filter module is set .. if non e is set all returns true
     *
     * @param filter
     * @private
     */
    public getChecked(filter) {
        if (filter == 'all') {
            return this.assistant.assistantFilters.objectfilters.length == 0 ? true : false;
        } else {
            return this.assistant.assistantFilters.objectfilters.indexOf(filter) >= 0 ? true : false;
        }
    }

    /**
     * closes the dialog
     *
     * @private
     */
    public closeDialog() {
        if (this.clickListener) {
            this.clickListener();
        }

        this.isOpen = false;
    }
}

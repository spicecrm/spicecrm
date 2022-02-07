/**
 * @module DirectivesModule
 */
import {Directive, ElementRef, Host, HostListener, Optional} from '@angular/core';
import {SystemDropdownTriggerDirective} from "./systemdropdowntrigger";

/**
 *
 */
@Directive({
    selector: '[system-dropdown-trigger-button]'
})
export class SystemDropdownTriggerButtonDirective {

    constructor(public elementRef: ElementRef, @Optional() @Host() public trigger: SystemDropdownTriggerDirective) {
    }

    /**
     * inform the parent that this trigger button exists
     */
    public ngOnInit() {
        if (!this.trigger) return;
        this.trigger.hasTriggerButton = true;
        this.trigger.triggerElementButton = this.elementRef;
    }

    /**
     * handle the button click to call openDropdown on the parent
     * @param event
     * @private
     */
    @HostListener('click', ['$event'])
    public onClick(event) {
        if (!this.trigger) return;
        this.trigger.toggleDropdown(event);
    }
}

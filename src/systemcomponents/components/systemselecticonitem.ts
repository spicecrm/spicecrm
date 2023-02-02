/**
 * @module SystemComponents
 */
import {
    Component, Input
} from "@angular/core";

/**
 * a simple component to be used as component in system-select-icon ....usage see there
 *
 * if used without any inputs it renders an empty value
 */
@Component({
    selector: "system-select-icon-item",
    template: ""
})
export class SystemSelectIconItem  {

    /**
     * the value of the item
     */
    @Input() public value: string = '';
    /**
     * the icon to be used
     */
    @Input() public icon: string = 'dash';
    /**
     * an optional class
     */
    @Input() public colorclass: 'slds-icon-text-default'|'slds-icon-text-success'|'slds-icon-text-warning'|'slds-icon-text-error'|'slds-icon-text-light' = 'slds-icon-text-default';

}

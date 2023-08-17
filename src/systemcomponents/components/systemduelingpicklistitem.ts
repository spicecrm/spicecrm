/**
 * @module SystemComponents
 */
import {
    Component, Input
} from "@angular/core";

/**
 * a simple component to be used as component in system-dueling-picklist ....usage see there
 */
@Component({
    selector: "system-dueling-picklist-item",
    template: ""
})
export class SystemDuelingPicklistItem  {

    /**
     * the value of the item
     */
    @Input() public id: string = '';

    /**
     * the value of the item
     */
    @Input() public label: string = '';

}

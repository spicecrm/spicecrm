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
    selector: "system-progress-indicator-item",
    template: ""
})
export class SystemProgressIndicatorItem  {

    /**
     * the value of the item
     */
    @Input() public value: string = '';
    /**
     * the icon to be used
     */
    @Input() public label: string = '';
    /**
     * the icon to be used
     */
    @Input() public status: ''|'complete'|'error' = '';


}

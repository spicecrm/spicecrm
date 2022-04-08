/**
 * @module ModuleSpicePath
 */
import {
    Component,
    Input
} from '@angular/core';
declare var _: any;

/**
 * displays the kanban SUM
 */
@Component({
    selector: 'spice-kanban-sumfield',
    templateUrl: '../templates/spicekanbansumfield.html'
})
export class SpiceKanbanSumField {

    /**
     * the number to be displayed
     */
    @Input() public value: any;
    @Input() public title: string;
    @Input() public symbol: string;


    /**
     * checks if value is NAN .. and in this case returns 0 waiting for the value to be set
     */
    get displayValue() {
         return !this.value || isNaN(this.value) ? 0 : this.value;
    }

}

/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";

/**
 * Displays a progress list indicator
 */
@Component({
    selector: "system-progress-list",
    templateUrl: "../templates/systemprogresslist.html"
})
export class SystemProgressList {

    /**
     * The progress of completion.
     */
    @Input() public step: number = 0;

    /**
     * the steps to be displayed as labels
     *
     * @private
     */
    @Input() public steps: string[] = [];

    /**
     * internal var to keep the value if se shoudl display shaded
     * @private
     */
    public _shade: boolean = false;

    /**
     * inpout to set the shade param with a setter so we can simply checkl the existence of the attribute
     *
     * @param val
     */
    @Input('system-progress-list-shade') set shade(val: boolean) {
        if (val === false) {
            this._shade = false;
        } else {
            this._shade = true;
        }
    }

    constructor() {
    }

    /**
     * returns the class for the step indicator
     *
     * @param step
     * @private
     */
    public getStepClass(step: string) {
        let thisIndex = this.steps.indexOf(step);
        if (thisIndex == this.step) {
            return 'slds-is-active';
        }
        if (thisIndex < this.step) {
            return 'slds-is-completed';
        }
    }


    /**
     * return if the current step is complete
     * @param step
     * @private
     */
    public getStepComplete(step: string) {
        let thisIndex = this.steps.indexOf(step);
        if (thisIndex < this.step) {
            return true;
        }
        return false;
    }

    /**
     * the width of the progressbar
     */
    get progressBarWidth() {
        return {
            width: (this.step / (this.steps.length - 1) * 100) + '%'
        };
    }

}

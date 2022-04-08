/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";

/**
 * displays a progress ring that is filling or draining
 */
@Component({
    selector: "system-progress-ring",
    templateUrl: "../templates/systemprogressring.html"
})
export class SystemProgressRing {
    /**
     * the completion percentage
     */
    @Input() public percentage: number = 100;

    /**
     * the size of the ring in px
     */
    @Input() public size: number = 24;

    /**
     * a status indicator:
     *  - warning turns yellow
     *  - expired turns red
     */
    @Input() public status: "" | "warning" | "expired" = "";

    /**
     * an optional background color if the ring is rendered in a contect with different background
     *
     * @private
     */
    @Input() public backgroundcolor: string;

    constructor(public language: language) {
    }

    /**
     * @ignore
     */
    get style() {
        return {
            height: this.size + 'px',
            width: this.size + 'px'
        };
    }

    /**
     * gets the colos for the inner ring
     */
    get innerStyle() {
        if (this.backgroundcolor) {
            return {background: this.backgroundcolor};
        }
        return {};
    }

    /**
     * @ignore
     */
    get fillPercentage() {
        return this.percentage / 100;
    }

    /**
     * internal helper to calculate the SVG
     */
    get d() {
        return "M 1 0 A 1 1 0 " + (this.percentage > 50 ? '1' : '0') + " 1 " + Math.cos(2 * Math.PI * this.fillPercentage) + " " + Math.sin(2 * Math.PI * this.fillPercentage) + " L 0 0";
    }

    /**
     * a getter to detemrine the proper SLDS Classes
     */
    get ringClass() {

        if (this.status == '' && this.percentage >= 100) return 'slds-progress-ring_complete';

        switch (this.status) {
            case 'warning':
                return 'slds-progress-ring_warning';
            case 'expired':
                return 'slds-progress-ring_expired';
        }
    }

    /**
     * a helper to dtermine if the status is completed
     */
    get iconstatus() {
        return (this.percentage >= 100) ? 'complete' : this.status;
    }
}

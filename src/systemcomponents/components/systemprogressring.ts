import {Component, Input} from "@angular/core";
import {language} from "../../services/language.service";

@Component({
    selector: "system-progress-ring",
    templateUrl: "./src/systemcomponents/templates/systemprogressring.html"
})
export class SystemProgressRing {
    @Input() private percentage: number = 100;
    @Input() private size: number = 24;
    @Input() private status: "" | "warning" | "expired" = "";

    constructor(private language: language) {}

    get style() {
        return {
            height: this.size + 'px',
            width: this.size + 'px'
        };
    }

    get fillPercentage() {
        return this.percentage / 100;
    }

    get d() {
        return "M 1 0 A 1 1 0 " + (this.percentage > 50 ? '1' : '0') + " 1 " + Math.cos(2 * Math.PI * this.fillPercentage) + " " + Math.sin(2 * Math.PI * this.fillPercentage) + " L 0 0";
    }

    get ringClass() {

        if (this.status == '' && this.percentage >= 100) return 'slds-progress-ring_complete';

        switch (this.status) {
            case 'warning':
                return 'slds-progress-ring_warning';
            case 'expired':
                return 'slds-progress-ring_expired';
        }
    }

    get iconstatus() {
        return (this.percentage >= 100) ? 'complete' : this.status;
    }
}

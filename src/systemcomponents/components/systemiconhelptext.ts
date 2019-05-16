/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-icon-help-text",
    templateUrl: "./src/systemcomponents/templates/systemiconhelptext.html"
})
export class SystemIconHelpText {
    @Input() private icon: string = 'info';
    @Input() private file: string = './assets/icons/spicecrm.svg';
    @Input() private size: string = '';
    @Input() private color: string = '';
    @Input() private hovercolor: string = '';
    @Input() private desaturate: boolean = false;
    @Input() private addclasses: string = ''
    @Input() private divClass = 'slds-media__figure';

    /**
     * helpText string
     */
    @Input() private helpText: string = "";

    constructor(private metadata: metadata) {

    }

    /**
     * All Params for the icon-component (system-custom-icon)
     */
    get gicon() {
        if(this.icon) {
            return this.icon;
        }
    }
    get gfile() {
        if (this.file) {
            return this.file;
        }
    }
    get gsizeClass() {
        if (this.size) {
            return this.size;
        }
    }
    get gcolor() {
        if (this.color) {
            return this.color;
        }
    }
    get ghovercolor() {
        if (this.hovercolor) {
            return this.hovercolor;
        }
    }
    get gdesaturate() {
        if (this.desaturate) {
            return this.desaturate;
        }
    }
    get gaddClass() {
        if (this.addclasses) {
            return this.addclasses;
        }
    }
    get gdivClass() {
        if (this.divClass) {
            return this.divClass;
        }
    }
}

/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-icon-help-text",
    templateUrl: "../templates/systemiconhelptext.html",
    standalone: false
})
export class SystemIconHelpText {
    @Input() public icon: string = 'info';
    @Input() public file: string = './assets/icons/spicecrm.svg';
    @Input() public size: string = 'xx-small'; // possible: xx-small, x-small, small, large
    @Input() public popoverMaxWidth: string = '300px';
    @Input() public color: string = '#bbb';
    @Input() public hovercolor: string = '#5B5B5B';
    @Input() public desaturate: boolean = false;
    @Input() public addclasses: string = '';
    @Input() public divClass = 'slds-media__figure';
    @Input() public verticalPositionBottom = false;

    /**
     * helpText string
     */
    @Input() public helpText: string = "";

    public showHelp: boolean = false;

    constructor(public metadata: metadata) {

    }

    /**
     * All Params for the icon-component (system-custom-icon)
     */
    get gicon() {
        if (this.icon) {
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

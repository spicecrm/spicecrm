/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-button-custom-icon",
    templateUrl: "../templates/systembuttoncustomicon.html"
})
export class SystemButtonCustomIcon {
    @Input() public icon: string;
    @Input() public size: string;
    @Input() public position: string;
    @Input() public inverse = false;
    @Input() public title = '';
    @Input() public file: string = './assets/icons/spicecrm.svg';

    constructor(public metadata: metadata) { }

    public getSvgHRef() {
        return this.file + '#' + this.icon;
    }

    public getClass() {
        let classList: string[] = [];
        if ( this.size ) {
            classList.push("slds-button__icon--" + this.size);
        } else {
            classList.push("slds-button__icon");
        }

        if ( this.position ) {
            classList.push("slds-button__icon_" + this.position);
        }

        if(this.inverse) {
            classList.push("slds-button_icon-inverse");
        }

        return classList;
    }
}


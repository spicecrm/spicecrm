import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-button-custom-icon",
    templateUrl: "./src/systemcomponents/templates/systembuttoncustomicon.html"
})
export class SystemButtonCustomIcon {
    @Input() private icon: string;
    @Input() private size: string;
    @Input() private position: string;
    @Input() private inverse = false;
    @Input() private title = '';
    @Input() private file: string = './assets/icons/spicecrm.svg';

    constructor(private metadata: metadata) { }

    private getSvgHRef() {
        return this.file + '#' + this.icon;
    }

    private getClass() {
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


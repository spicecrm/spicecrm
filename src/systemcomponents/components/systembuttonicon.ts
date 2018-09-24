import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-button-icon",
    templateUrl: "./src/systemcomponents/templates/systembuttonicon.html"
})
export class SystemButtonIcon {
    @Input() private icon: string = "";
    @Input() private size: string = "";
    @Input() private position: string = "";
    @Input() private inverse: boolean = false;
    @Input() private title: string = undefined;

    constructor(private metadata: metadata) {
    }

    private getSvgHRef() {
        return "./sldassets/icons/utility-sprite/svg/symbols.svg#" + this.icon;
    }

    private getClass() {
        let classList: Array<string> = [];
        if (this.size !== "") {
            classList.push("slds-button__icon--" + this.size);
        } else {
            classList.push("slds-button__icon");
        }
        if (this.position !== "") {
            classList.push("slds-button__icon_" + this.position);
        }

        if (this.inverse) {
            classList.push("slds-button_icon-inverse");
        }

        return classList;
    }
}


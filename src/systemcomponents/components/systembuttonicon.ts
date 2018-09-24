import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-button-icon",
    templateUrl: "./src/systemcomponents/templates/systembuttonicon.html"
})
export class SystemButtonIcon {
    @Input() private icon: string = "";
    @Input() private sprite: string = "utility";
    @Input() private size: string = "";
    @Input() private module: string = "";
    @Input() private position: string = "";
    @Input() private inverse: boolean = false;
    @Input() private title: string = undefined;

    constructor(private metadata: metadata) {
    }

    private getSvgHRef() {
        return "./sldassets/icons/" + this.getSprite() + "-sprite/svg/symbols.svg#" + this.getIcon();
    }

    private getIcon() {
        if(this.icon) {
            return this.icon;
        }

        if(this.module && this.metadata.getModuleIcon(this.module) ) {
            let moduleIcon = this.metadata.getModuleIcon(this.module);

            return moduleIcon.indexOf(":") > 0 ? moduleIcon.split(":")[1] : moduleIcon;
        }

        return "empty";
    }

    private getSprite() {
        if(this.module && this.metadata.getModuleIcon(this.module) && this.metadata.getModuleIcon(this.module).indexOf(":") > 0) {
            return this.metadata.getModuleIcon(this.module).split(":")[0]
        } else {
            return this.sprite;
        }
    }

    private getClass() {
        let classList: Array<string> = [];
        if(this.size != "") {
            classList.push("slds-button__icon--" + this.size);
        } else {
            classList.push("slds-button__icon");
        }

        if ( this.position != "" ) {
            classList.push("slds-button__icon_" + this.position);
        }

        if(this.inverse) {
            classList.push("slds-button_icon-inverse");
        }

        return classList;
    }
}


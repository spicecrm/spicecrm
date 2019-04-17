/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-icon",
    templateUrl: "./src/systemcomponents/templates/systemicon.html"
})
export class SystemIcon {
    @Input() private module: string = "";
    @Input() private icon: string = "";
    @Input() private size: string = "";
    @Input() private sprite: string = "standard";
    @Input() private addclasses: string = ""
    @Input() private divClass = "slds-media__figure";


    constructor(private metadata: metadata) {

    }

    private getSizeClass() {
        if (this.size) {
            return "slds-icon--" + this.size;
        } else {
            return "";
        }
    }

    private getSvgHRef() {
        return "./sldassets/icons/" + this.getSprite() + "-sprite/svg/symbols.svg#" + this.getIcon();
    }

    private getIconClass() {
        switch (this.sprite) {
            case "standard":
            case "custom":
                return "slds-icon" + (this.size ? " slds-icon--" + this.size : "") + " slds-icon-" + this.getSprite() + "-" + this.getIcon().replace(/_/g, "-") + " " + this.addclasses;
            default:
                return "slds-icon" + (this.size ? " slds-icon--" + this.size : "") + " slds-icon-text-default" + " " + this.addclasses;
        }
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
            return this.metadata.getModuleIcon(this.module).split(":")[0];
        } else {
            return this.sprite;
        }
    }
}
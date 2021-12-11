/**
 * @module SystemComponents
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../services/metadata.service";

@Component({
    selector: "system-icon",
    templateUrl: "../templates/systemicon.html"
})
export class SystemIcon {
    @Input() public module: string = "";
    @Input() public icon: string = "";
    @Input() public size: ''|'large' | 'small' | 'x-small' | 'xx-small' = '';
    @Input() public sprite: string = "standard";
    @Input() public addclasses: string = "";
    @Input() public divClass = "slds-media__figure";

    constructor(public metadata: metadata) {

    }

    public getSizeClass() {
        if (this.size) {
            return "slds-icon--" + this.size;
        } else {
            return "";
        }
    }

    public getSvgHRef() {
        return "./vendor/sldassets/icons/" + this.getSprite() + "-sprite/svg/symbols.svg#" + this.getIcon();
    }

    public getIconClass() {
        switch (this.sprite) {
            case "standard":
            case "action":
            case "custom":
                return "slds-icon" + (this.size ? " slds-icon--" + this.size : "") + " slds-icon-" + this.getSprite() + "-" + this.getIcon().replace(/_/g, "-") + " " + this.addclasses;
            default:
                return "slds-icon" + (this.size ? " slds-icon--" + this.size : "") + " slds-icon-text-default" + " " + this.addclasses;
        }
    }


    public getIcon() {
        if(this.icon) {
            return this.icon.indexOf(":") > 0 ? this.icon.split(":")[1] : this.icon;
        }

        if(this.module && this.metadata.getModuleIcon(this.module) ) {
            let moduleIcon = this.metadata.getModuleIcon(this.module);
            return moduleIcon.indexOf(":") > 0 ? moduleIcon.split(":")[1] : moduleIcon;
        }

        return "empty";
    }

    public getSprite() {
        if(this.icon && this.icon.indexOf(":") > 0) {
            return this.icon.split(":")[0];
        }

        if(this.module && this.metadata.getModuleIcon(this.module) && this.metadata.getModuleIcon(this.module).indexOf(":") > 0) {
            return this.metadata.getModuleIcon(this.module).split(":")[0];
        } else {
            return this.sprite;
        }
    }
}

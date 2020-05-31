/**
 * @module SystemComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {metadata} from "../../services/metadata.service";

/**
 * renders an icon that can be embedded in a button.
 */
@Component({
    selector: "system-button-icon",
    templateUrl: "./src/systemcomponents/templates/systembuttonicon.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemButtonIcon implements OnChanges {

    /**
     * the name of the icon to be rendered
     *
     * - it can be a simple name of an icon .. then it is rendered as a utility icon
     * - it can be a string sepoarated with the sprite and the icon. e.g. 'standard:decision' then the sprite is taken form the icon
     *  - it can hold sprite, icon and size override. e.g. 'standard:decision:medium'
     *
     */
    @Input() private icon: string = "";

    /**
     * the sprite the icon is found in
     */
    @Input() private sprite: string = "utility";

    @Input() private size: ''|'large' | 'small' | 'x-small' | 'xx-small' = "";

    /**
     * a module name if the icon shoudl be loaded from teh metadata
     */
    @Input() private module: string = "";

    /**
     * the position of the button icon
     */
    @Input() private position: ''|'left'|'right' = "";

    /**
     * if the icon shoudl be rendered inverted
     */
    @Input() private inverse: boolean = false;

    /**
     * a title for the icon
     */
    @Input() private title: string = undefined;

    /**
     * any additonal classes that shoudl be applied to the button
     */
    @Input() private addclasses: string = "";

    constructor(private metadata: metadata, private cdref: ChangeDetectorRef) {
    }

    /**
     * triger change dtection as the cdref is onpush strategy
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.cdref.detectChanges();
    }

    /**
     * loads the SVG ref for the svg in the button
     */
    private getSvgHRef() {
        return "./vendor/sldassets/icons/" + this.getSprite() + "-sprite/svg/symbols.svg#" + this.getIcon();
    }

    /**
     * loads the icon to be added with the svg
     */
    private getIcon() {
        if (this.icon) {
            return this.icon;
        }

        if (this.module && this.metadata.getModuleIcon(this.module)) {
            let moduleIcon = this.metadata.getModuleIcon(this.module);

            return moduleIcon.indexOf(":") > 0 ? moduleIcon.split(":")[1] : moduleIcon;
        }

        return "empty";
    }

    /**
     * returns the sprite
     */
    private getSprite() {
        if (this.module && this.metadata.getModuleIcon(this.module) && this.metadata.getModuleIcon(this.module).indexOf(":") > 0) {
            return this.metadata.getModuleIcon(this.module).split(":")[0];
        } else if (this.module) {
            return 'standard';
        } else {
            return this.sprite;
        }
    }

    /**
     * builds a string with additonal classes
     */
    private getClass() {
        let classList: string[] = [];
        if (this.size != "") {
            classList.push("slds-button__icon--" + this.size);
        } else {
            classList.push("slds-button__icon");
        }

        if (this.position != "") {
            classList.push("slds-button__icon_" + this.position);
        }

        if (this.inverse) {
            classList.push("slds-button_icon-inverse");
        }

        return this.addclasses ? this.addclasses + ' ' + classList : classList;
    }
}


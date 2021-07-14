/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
            return this.icon.indexOf(":") > 0 ? this.icon.split(":")[1] : this.icon;
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
        if(this.icon && this.icon.indexOf(":") > 0) {
            return this.icon.split(":")[0];
        } else if (this.module && this.metadata.getModuleIcon(this.module) && this.metadata.getModuleIcon(this.module).indexOf(":") > 0) {
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


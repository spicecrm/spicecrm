/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';

/**
 * an icon rendered from the utility spirte
 */
@Component({
    selector: 'system-utility-icon',
    templateUrl: './src/systemcomponents/templates/systemutilityicon.html'
})
export class SystemUtilityIcon {
    /**
     * the name of the icon to be rendered
     */
    @Input() private icon: string = '';

    /**
     * the size of the icon
     */
    @Input() private size: 'large' | 'small' | 'x-small' | 'xx-small' = 'small';

    /**
     * a string of classes that can be passed in and is added to the SVG
     */
    @Input() private addclasses: string = '';

    /**
     * an optional color class: can be any of the avialable SLDS icon color classes
     */
    @Input() private colorclass: string = 'slds-icon-text-default';

    /**
     * a string for the title that is rendered as part of the SVG HTML element
     */
    @Input() private title: string = '';

    /**
     * returns the SVG href
     */
    private getSvgHRef() {
        return './sldassets/icons/utility-sprite/svg/symbols.svg#' + this.icon;
    }

    /**
     * retuns the icon class for the ngClass in the template
     */
    private getIconClass() {
        return 'slds-icon' + (this.size ? ' slds-icon--' + this.size : '') + ' ' + this.colorclass + ' ' + this.addclasses;

    }
}

/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';

/**
 * @deprecated
 */
@Component({
    selector: 'global-nevigation-menu-item-icon',
    templateUrl: '../templates/globalnavigationmenuitemicon.html'
})
export class GlobalNavigationMenuItemIcon {
    @Input() icon: string = '';

    getSvgHRef() {
        return './vendor/sldassets/icons/utility-sprite/svg/symbols.svg#' + this.icon;
    }

}

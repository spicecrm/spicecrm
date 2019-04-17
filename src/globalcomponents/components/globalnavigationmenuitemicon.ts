/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'global-nevigation-menu-item-icon',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemicon.html'
})
export class GlobalNavigationMenuItemIcon {
    @Input() icon: string = '';

    getSvgHRef() {
        return './sldassets/icons/utility-sprite/svg/symbols.svg#' + this.icon;
    }

}

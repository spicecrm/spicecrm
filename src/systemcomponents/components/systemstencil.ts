/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';

/**
 * a generic stencil component that shodul be rendered for fields while data to be dsplayed is being loaded.
 */
@Component({
    selector: 'system-stencil',
    template: '<div class="slds-theme--shade" style="background-color:#e4e9f3; min-width:100px;">&nbsp;</div>'
})
export class SystemStencil {
}

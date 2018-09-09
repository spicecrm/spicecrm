import { Component, Input } from '@angular/core';
import { metadata } from '../../services/metadata.service';

@Component({
    selector: 'object-icon',
    templateUrl: './app/objectcomponents/templates/objecticon.html'
})
export class ObjectIcon {
    @Input() module: string = '';
    @Input() icon: string = '';
    @Input() size: string = '';
    @Input() sprite: string = 'standard';

    constructor( private metadata: metadata ) {

    }

    getSizeClass(){
        if(this.size)
            return 'slds-icon--' + this.size;
        else
            return ''
    }

    getSvgHRef(){
        return './sldassets/icons/'+this.getSprite()+'-sprite/svg/symbols.svg#' + this.getIcon();
    }

    getIconClass(){
        return 'slds-icon'+ (this.size ? ' slds-icon--' + this.size : '') +' slds-icon-'+this.getSprite()+'-'+ this.getIcon().replace(/_/g, '-');
    }

    getIcon(){
        if(this.icon)
            return this.icon;

        if(this.module && this.metadata.getModuleIcon(this.module) ) {
            let moduleIcon = this.metadata.getModuleIcon(this.module);

            return moduleIcon.indexOf(':') > 0 ? moduleIcon.split(':')[1] : moduleIcon;
        }

        return 'empty';
    }

    getSprite(){
        if(this.module && this.metadata.getModuleIcon(this.module) && this.metadata.getModuleIcon(this.module).indexOf(':') > 0)
            return this.metadata.getModuleIcon(this.module).split(':')[0]
         else
            return this.sprite;
    }
}
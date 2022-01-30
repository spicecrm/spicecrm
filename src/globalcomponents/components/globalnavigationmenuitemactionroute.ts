/**
 * @module GlobalComponents
 */
import {
    Component,
} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    templateUrl: '../templates/globalnavigationmenuitemactionroute.html'
})
export class GlobalNavigationMenuItemActionRoute {

    /**
     * the action config passed in from teh container
     */
   public actionconfig: any = {};

    /**
     * if the item is disabled
     */
    // public disabled: boolean = false;

    constructor(public language: language, public model: model, public metadata: metadata, public router: Router) {
    }

    /**
     * a getter extracting the icon from the action config
     */
    get actionicon() {
        return this.actionconfig.icon ? this.actionconfig.icon : 'chevronright';
    }

    /**
     * get the hidden atribute if the acl right is not granted
     */
    get disabled(){
        return this.actionconfig.acl && !this.metadata.checkModuleAcl(this.model.module, this.actionconfig.acl);
    }

    /**
     * get the hidden atribute if the acl right is not granted
     */
    get hidden(){
        return this.actionconfig.acl && !this.metadata.checkModuleAcl(this.model.module, this.actionconfig.acl);
    }

    /**
     * a getter to extzract the label to be used from teh action config
     */
    get actionlabel() {
        if (this.actionconfig.label && this.actionconfig.label.indexOf(':') > -1) {
            let labelData = this.actionconfig.label.split(':');
            return this.language.getLabel(labelData[0], labelData[1]);
        } else {
            return this.language.getLabel(this.actionconfig.label);
        }
    }

    /**
     * the execute function to naviogate to the route defined in the action
     */
    public execute() {
        if(!this.disabled) {
            this.router.navigate([this.actionconfig.route]);
        }
    }
}

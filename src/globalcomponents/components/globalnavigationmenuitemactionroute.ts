/**
 * @module GlobalComponents
 */
import {
    Component,
} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemactionroute.html'
})
export class GlobalNavigationMenuItemActionRoute {

    /**
     * the action config passed in from teh container
     */
    private actionconfig: any = {};

    /**
     * if the item is disabled
     */
    public disabled: boolean = false;

    constructor(private language: language, private model: model, private router: Router) {
    }

    /**
     * a getter extracting the icon from the action config
     */
    get actionicon() {
        return this.actionconfig.icon ? this.actionconfig.icon : 'chevronright';
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
        this.router.navigate([this.actionconfig.route]);
    }
}

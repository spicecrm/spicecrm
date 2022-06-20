/**
 * @module GlobalComponents
 */
import {
    Component
} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

interface menuItem {
    module: string;
    name: string
}

/**
 * @deprecated
 */
@Component({
    selector: 'global-navigation-menu-item-route',
    templateUrl: '../templates/globalnavigationmenuitemroute.html'
})
export class GlobalNavigationMenuItemRoute {
    clickListener: any;
    actionconfig: any = {};

    constructor(public metadata: metadata,
               public language: language,
               public model: model,
               public router: Router) {
    }

    get actionicon() {
        return this.actionconfig.icon ? this.actionconfig.icon : 'chevronright';
    }

    get actionlabel() {
        if (this.actionconfig.label && this.actionconfig.label.indexOf(':') > -1) {
            let labelData = this.actionconfig.label.split(':');
            return this.language.getLabel(labelData[0], labelData[1]);
        } else {
            return this.language.getLabel(this.actionconfig.label);
        }
    }

    exceuteItem() {
        this.router.navigate([this.actionconfig.route]);
    }

}

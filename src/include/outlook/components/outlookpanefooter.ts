import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
 * Outlook add-in component used to display the footer.
 */
@Component({
    selector: 'outlook-pane-footer',
    templateUrl: './src/include/outlook/templates/outlookpanefooter.html'
})
export class OutlookPaneFooter {

    private _currentroute: string = 'mailitem';

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language
    ) {}

    /**
     * Navigates the user to a selected action.
     *
     * @param action
     */
    private callAction(action) {
        this.router.navigate([action.actionconfig.route]);
    }

    /**
     * Getter for the current route.
     */
    get currentroute() {
        return this._currentroute;
    }

    /**
     * Setter for the current route.
     *
     * @param route
     */
    set currentroute(route) {
        if (route) {
            this._currentroute = route;
            this.router.navigate([route]);
        }
    }

    /**
     * Getter for the available actions. They are read from the SpiceCRM configuration.
     */
    get actions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
        }
        return [];
    }
}

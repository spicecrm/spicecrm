/**
 * @module Outlook
 */
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";


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
    ) {
    }

    private callAction(action) {
        this.router.navigate([action.actionconfig.route]);
    }

    get currentroute() {
        return this._currentroute;
    }

    set currentroute(route) {
        if (route) {
            this._currentroute = route;
            this.router.navigate([route]);
        }
    }

    get actions() {
        let componentConfig = this.metadata.getComponentConfig('OutlookPane');
        if (componentConfig.actionset) {
            return this.metadata.getActionSetItems(componentConfig.actionset);
        }
        return [];
    }
}

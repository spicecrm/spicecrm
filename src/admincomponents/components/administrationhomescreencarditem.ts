/**
 * @module AdminComponentsModule
 */
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    selector: '[administration-card-item]',
    templateUrl: './src/admincomponents/templates/administrationhomescreencarditem.html'
})

export class AdministrationHomeScreenCardItem {

    @Input() public adminNavigationItem: any = {};
    @Input() public adminNavigationBlock: string = '';

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private administration: administration
    ) {
    }

    /**
     * emit nav changes to main screen
     *
     * @param item
     */
    private openContent() {
        this.administration.navigateto(this.adminNavigationItem.id);
    }

    /**
     * returns the icon
     */
    get icon() {
        return this.adminNavigationItem.icon ? this.adminNavigationItem.icon : 'empty';
    }

}

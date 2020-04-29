/**
 * @module AdminComponentsModule
 */
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';
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
        private administration: administration,
        private navigationtab: navigationtab
    ) {
    }

    /**
     * emit nav changes to main screen
     *
     * @param item
     */
    private openContent() {
        // set the admin label for teh component
        let adminLabel = this.administration.getItemLabel(this.adminNavigationItem.id);
        this.navigationtab.setTabInfo({displayname: this.language.getLabel(adminLabel ? adminLabel : 'LBL_ADMINISTRATION'), displayicon: 'settings'});

        this.administration.navigateto(this.adminNavigationItem.id);
    }

    /**
     * returns the icon
     */
    get icon() {
        return this.adminNavigationItem.icon ? this.adminNavigationItem.icon : 'empty';
    }

}

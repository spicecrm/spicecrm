/**
 * @module AdminComponentsModule
 */
import {
    Component,
    Output
} from '@angular/core';
import {language} from '../../services/language.service';
import {navigationtab} from '../../services/navigationtab.service';
import {administration} from "../services/administration.service";

@Component({
    selector: 'administration-menu',
    templateUrl: '../templates/administrationmenu.html'
})
export class AdministrationMenu {

    constructor(
        public language: language,
        public navigationtab: navigationtab,
        public administration: administration
    ) {

    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    public trackbyfn(index, item) {
        return item.id;
    }

    /**
     * emit nav changes to main screen
     *
     * @param item
     */
    public openContent(itemid) {
        // already loaded?
        if (this.administration.opened_itemid == itemid) {
            return true;
        }

        // set the admin label for teh component
        let adminLabel = this.administration.getItemLabel(itemid);
        this.navigationtab.setTabInfo({displayname: this.language.getLabel(adminLabel ? adminLabel : 'LBL_ADMINISTRATION'), displayicon: 'settings'});

        // start the navigation
        this.administration.navigateto(itemid);
    }

}

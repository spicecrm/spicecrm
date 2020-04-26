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
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu {

    constructor(
        private language: language,
        private navigationtab: navigationtab,
        private administration: administration
    ) {

    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * emit nav changes to main screen
     *
     * @param item
     */
    private openContent(itemid) {
        // already loaded?
        if (this.administration.opened_itemid == itemid) {
            return true;
        }

        // set the tab info back to administration in case the current opened tba changed it
        this.navigationtab.setTabInfo({displayname: this.language.getLabel('LBL_ADMINISTRATION'), displayicon: 'settings'});

        // trigger admin navigation
        this.administration.navigateto(itemid);
    }

}

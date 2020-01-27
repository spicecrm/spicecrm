/**
 * @module AdminComponentsModule
 */
import {
    Component,
    Output
} from '@angular/core';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    selector: 'administration-menu',
    templateUrl: './src/admincomponents/templates/administrationmenu.html'
})
export class AdministrationMenu {

    constructor(
        private language: language,
        private administration: administration,
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

        this.administration.navigateto(itemid);
    }

}

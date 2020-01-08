/**
 * @module AdminComponentsModule
 */
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    selector: 'administration-card-item',
    templateUrl: './src/admincomponents/templates/administrationhomescreencarditem.html'
})

export class AdministrationHomeScreenCardItem {
    @Input() public adminNavigationBlock;
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
    private openContent(block, item) {
        this.administration.navigateto(block, item);
    }

}

/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    selector: 'administration-card',
    templateUrl: './src/admincomponents/templates/administrationhomescreencard.html'
})

export class AdministrationHomeScreenCard {

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

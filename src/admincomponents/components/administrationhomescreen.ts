/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({

    templateUrl: './src/admincomponents/templates/administrationhomescreen.html'
})

export class AdministrationHomeScreen {

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
        private administration: administration
    ) {
    }


}

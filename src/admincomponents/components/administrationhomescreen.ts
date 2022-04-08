/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    templateUrl: '../templates/administrationhomescreen.html'
})

export class AdministrationHomeScreen {

    constructor(
        public router: Router,
        public metadata: metadata,
        public language: language,
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

}

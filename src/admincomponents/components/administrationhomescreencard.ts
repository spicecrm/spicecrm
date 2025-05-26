/**
 * @module AdminComponentsModule
 */
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {administration} from "../services/administration.service";

@Component({
    selector: 'administration-card',
    templateUrl: '../templates/administrationhomescreencard.html',
    standalone: false
})

export class AdministrationHomeScreenCard {

    @Input() public adminNavigationBlock: any;

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

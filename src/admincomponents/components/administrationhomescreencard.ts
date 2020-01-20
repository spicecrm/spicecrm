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
    templateUrl: './src/admincomponents/templates/administrationhomescreencard.html'
})

export class AdministrationHomeScreenCard {

    @Input() private adminNavigationBlock: any;

    constructor(
        private router: Router,
        private metadata: metadata,
        private language: language,
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

}

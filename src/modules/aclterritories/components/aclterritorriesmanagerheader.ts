/**
 * @module ModuleACLTerritories
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'aclterritorries-manager-header',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerheader.html',
})
export class ACLTerritorriesManagerHeader {

    @Input() displaylabel: string = '';

    constructor(private language: language) {

    }

}
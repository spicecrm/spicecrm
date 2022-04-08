/**
 * @module ModuleACL
 */
import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'acl-manager-header',
    templateUrl: '../templates/aclmanagerheader.html',
})
export class ACLManagerHeader {

    @Input() displaylabel: string = '';

    constructor(public language: language) {

    }

}

import {Component, Input} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'acl-manager-header',
    templateUrl: './src/modules/acl/templates/aclmanagerheader.html',
})
export class ACLManagerHeader {

    @Input() displaylabel: string = '';

    constructor(private language: language) {

    }

}
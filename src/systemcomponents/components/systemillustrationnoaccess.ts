/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-illustration-no-access',
    templateUrl: '../templates/systemillustrationnoaccess.html',
    standalone: false
})
export class SystemIllustrationNoAccess {

    constructor(public language: language) {

    }

}

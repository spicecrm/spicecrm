/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-illustration-no-access',
    templateUrl: './src/systemcomponents/templates/systemillustrationnoaccess.html'
})
export class SystemIllustrationNoAccess {

    constructor(private language: language) {

    }

}

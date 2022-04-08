/**
 * @module SystemComponents
 */
import {Component} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-illustration-no-task',
    templateUrl: '../templates/systemillustrationnotask.html'
})
export class SystemIllustrationNoTask {

    constructor(public language: language) {

    }

}

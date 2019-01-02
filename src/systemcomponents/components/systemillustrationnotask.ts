import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-illustration-no-task',
    templateUrl: './src/systemcomponents/templates/systemillustrationnotask.html'
})
export class SystemIllustrationNoTask {

    constructor(private language: language) {

    }

}

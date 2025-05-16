/**
 * @module SystemComponents
 */
import {Component, Input} from '@angular/core';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-illustration',
    templateUrl: '../templates/systemillustration.html'
})
export class SystemIllustration {

    @Input() public illustration: 'gonefishing'|'research'|'setup';

    constructor(public language: language) {

    }

}

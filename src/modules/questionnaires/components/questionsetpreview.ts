import {Component} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionset-preview',
    templateUrl: './app/modules/questionnaires/templates/questionsetpreview.html',
})
export class QuestionsetPreview {

    questionsetidorobject: any;
    self: any = null;

    constructor( private language: language ) {}

    closePopup() {
        this.self.destroy();
    }

}
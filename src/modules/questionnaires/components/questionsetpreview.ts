/**
 * @module ModuleQuestionnaires
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionset-preview',
    templateUrl: './src/modules/questionnaires/templates/questionsetpreview.html',
})
export class QuestionsetPreview {

    public questionsetIdOrObject: any;
    private self: any = null;

    constructor( private language: language ) {}

    private closePopup() {
        this.self.destroy();
    }

}

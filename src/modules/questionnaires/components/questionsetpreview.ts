/**
 * @module ModuleQuestionnaires
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionset-preview',
    templateUrl: './src/modules/questionnaires/templates/questionsetpreview.html',
})
export class QuestionsetPreview {

    public questionsetIdOrObject: any;
    private self: any = null;
    private qp: any;

    constructor( private language: language, private questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    private closePopup() {
        this.self.destroy();
    }

}

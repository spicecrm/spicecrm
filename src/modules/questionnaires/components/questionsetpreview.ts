/**
 * @module ModuleQuestionnaires
 */
import {Component} from '@angular/core';
import {language} from '../../../services/language.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionset-preview',
    templateUrl: '../templates/questionsetpreview.html',
})
export class QuestionsetPreview {

    public questionsetIdOrObject: any;
    public self: any = null;
    public qp: any;

    constructor( public language: language, public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public closePopup() {
        this.self.destroy();
    }

}

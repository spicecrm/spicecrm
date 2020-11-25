/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionnaire-render',
    templateUrl: './src/modules/questionnaires/templates/questionnairerender.html',
    styles: [
        '::ng-deep .questionnaire-some-words p { margin: 0.5rem 0; }',
        '::ng-deep .questionnaire-some-words p:first-child { margin-top: 0; }',
        '::ng-deep .questionnaire-some-words p:last-child { margin-bottom: 0; }'
    ]
})
export class QuestionnaireRender {

    constructor( private language: language, private backend: backend, private questionnaireParticipation: questionnaireParticipationService ) { }

    public reload(): void {
        if ( !this.questionnaireParticipation.isLoading ) this.questionnaireParticipation.reloadQuestionsets();
    }

}

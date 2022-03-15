/**
 * @module ModuleQuestionnaires
 */
import {Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {questionnaireParticipationService} from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionnaire-preview',
    templateUrl: '../templates/questionnairepreview.html',
})
export class QuestionnairePreview {

    @Input() public questionnaireId: string;
    public isLoaded = false;
    public self: any = null;
    public questionnaireParticipation: questionnaireParticipationService;

    constructor( public language: language, public backend: backend ) { }

    public closePopup(): void {
        this.self.destroy();
    }

}

/**
 * @module ModuleQuestionnaires
 */
import {Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {questionnaireParticipationService} from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionnaire-preview',
    templateUrl: './src/modules/questionnaires/templates/questionnairepreview.html',
})
export class QuestionnairePreview {

    @Input() public questionnaireId: string;
    private isLoaded = false;
    private self: any = null;
    private questionnaireParticipation: questionnaireParticipationService;

    constructor( private language: language, private backend: backend ) { }

    private closePopup(): void {
        this.self.destroy();
    }

}

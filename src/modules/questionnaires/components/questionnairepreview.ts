/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionnaire-preview',
    templateUrl: './src/modules/questionnaires/templates/questionnairepreview.html',
    providers: [questionnaireParticipationService]
})
export class QuestionnairePreview implements OnInit {

    @Input() public questionnaireId: string;
    private questionnaire: any;
    private isLoading = true;
    private self: any = null;

    constructor( private language: language, private backend: backend, private questionnaireParticipation: questionnaireParticipationService ) { }

    public ngOnInit(): void {
        this.backend.getRequest( 'module/Questionnaires/'+this.questionnaireId ).subscribe( (response: any) => {
            this.questionnaire = response;
            this.questionnaireParticipation.showQuestionnaireTitle = false;
            this.questionnaireParticipation.editMode = 'preview';
            this.questionnaireParticipation.init_byQuestionnaire( this.questionnaire );
            this.isLoading = false;
        });
    }

    private closePopup(): void {
        this.self.destroy();
    }

}

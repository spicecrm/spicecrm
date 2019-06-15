/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionnaire-preview',
    templateUrl: './src/modules/questionnaires/templates/questionnairepreview.html',
})
export class QuestionnairePreview implements OnInit {

    @Input() public questionnaireId: string;
    private questionsets: any[] = [];
    private questionnaire: any;
    private isLoading = true;
    private self: any = null;

    constructor( private language: language, private backend: backend ) { }

    public ngOnInit(): void {
        this.backend.getRequest( 'module/Questionnaires/'+this.questionnaireId ).subscribe( (response: any) => {
            this.questionnaire = response;
            this.isLoading = false;
        });
    }

    private closePopup(): void {
        this.self.destroy();
    }

}

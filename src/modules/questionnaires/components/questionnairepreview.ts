/**
 * @module ModuleQuestionnaires
 */
import {Component} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionnaire-preview',
    templateUrl: './src/modules/questionnaires/templates/questionnairepreview.html',
})
export class QuestionnairePreview {

    questionnaireId: string;
    questionsets: Array<any> = [];
    questionnaire: Object;
    isLoading = true;
    self: any = null;

    constructor( private language: language, private backend: backend ) { }

    ngOnInit() {
        this.backend.getRequest('module/Questionnaires/'+this.questionnaireId).subscribe( (response: any) => {
            this.questionnaire = response;
            this.isLoading = false;
        });
    }

    closePopup() {
        this.self.destroy();
    }

}
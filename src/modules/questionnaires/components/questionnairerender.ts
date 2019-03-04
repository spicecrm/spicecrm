/**
 * @module ModuleQuestionnaires
 */
import {Component, Input} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionnaire-render',
    templateUrl: './src/modules/questionnaires/templates/questionnairerender.html',
})
export class QuestionnaireRender {

    questionsets: Array<any> = [];
    @Input() questionnaire: any;

    constructor( private language: language, private backend: backend ) { }

    ngOnInit() {
        if ( this.questionnaire.questionsets && this.questionnaire.questionsets.beans ) {
            for (let key of Object.keys(this.questionnaire.questionsets.beans)) {
                this.questionsets.push(this.questionnaire.questionsets.beans[key]);
            }
            this.questionsets.sort((a, b) => {
                return a.position - b.position;
            });
        }
    }

}
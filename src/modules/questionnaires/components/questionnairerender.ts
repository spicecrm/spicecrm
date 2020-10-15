/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionnaire-render',
    templateUrl: './src/modules/questionnaires/templates/questionnairerender.html',
    styles: [
        '::ng-deep .questionnaire-some-words p { margin: 0.5rem 0; }',
        '::ng-deep .questionnaire-some-words p:first-child { margin-top: 0; }',
        '::ng-deep .questionnaire-some-words p:last-child { margin-bottom: 0; }'
    ]
})
export class QuestionnaireRender implements OnInit {

    @Input() public questionnaire: any;
    @Input() public inModal: true;
    @Input() public showQuestionnaireTitle = true;
    @Input() public previewMode = false;

    private questionsets: any[] = [];
    private isLoading = true;

    constructor( private language: language, private backend: backend ) { }

    public ngOnInit() {
        this.loadQuestionsets();
    }

    private loadQuestionsets(): void {
        this.isLoading = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.questionnaire.id+'/related/questionsets', {limit: 999}).subscribe( questionsets => {

            for (let key of Object.keys( questionsets )) this.questionsets.push( questionsets[key] );
            this.questionsets.sort((a, b) => {
                return a.position - b.position;
            });

            this.isLoading = false;
        });
    }

    public reload(): void {
        if ( !this.isLoading ) this.loadQuestionsets();
    }

}

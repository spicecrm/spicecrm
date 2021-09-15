/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component({
    selector: 'question-render-rating',
    templateUrl: './src/modules/questionnaires/templates/questionrenderrating.html',
    styles: [
        'table { border-top: none; }',
        'th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}',
        'tr:first-child td { border-top: none; }',
        'div.question-render-question { border-radius:0; }',
        'td.question-hover:hover { background-color: #f3f2f2; }',
        'td { padding: 0.5rem 0.75rem; }'
    ]
})
export class QuestionRenderRating extends QuestionRenderBasic implements OnInit {

    @Input() private hideFinishedQuestions = false;
    @Input() private imageWidthQuestion = 200;

    private ratingValuesHaveAlsoText = false;
    private altTexts = {};

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {

        super.ngOnInit();

        if ( this.questionMeta.parameter.altTexts !== 'undefined' ) this.altTexts = this.questionMeta.parameter.altTexts;
        // Is there any rating value with an alternative text?
        for ( let id in this.altTexts ) {
            if ( this.altTexts[id] != '' ) {
                this.ratingValuesHaveAlsoText = true;
                break;
            }
        }

    }

    private onClick( optionId: string ): boolean {
        return this.questionnaireParticipation.clickAnswerOption( this.questionId, optionId );
    }

    private isChecked( optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[this.questionId] && this.qp.answers[this.questionId].options && this.qp.answers[this.questionId].options[optionId];
    }

}

/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';

@Component({
    selector: 'questionset-render-rating',
    templateUrl: '../templates/questionsetrenderrating.html',
    styles: [
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }",
        'td { padding: 0.5rem 0.75rem; }',
        'td.question-hover:hover { background-color: #f3f2f2; }'
    ]
})
export class QuestionsetRenderRating extends QuestionsetRenderBasic implements OnInit {

    @Input() public hideFinishedQuestions = false;

    public ratingValuesHaveAlsoText = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {

        super.ngOnInit();

        // Is there any rating value with an alternative text?
        for ( let entry of this.questiontypeparameter.rating.entries ) {
            if ( entry.text !== '' ) {
                this.ratingValuesHaveAlsoText = true;
                break;
            }
        }

    }

    public onClick( optionId: string, $event ): boolean {
        return this.qp.clickAnswerOption( optionId, $event );
    }

    public isChecked( questionId: string, optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[questionId] && this.qp.answers[questionId].options && this.qp.answers[questionId].options[optionId];
    }

    public showError( question ): boolean {
        return !this.qp.questionsMeta[question.id].finished && question.answer_required && this.qp.showInvalidities
    }

    public getValue( questionId: string, optionId: string ): boolean {
        return this.qp.answers[questionId].options[optionId];
    }

    public setValue( value: boolean, questionId: string, optionId: string ): void {
        this.qp.clickAnswerOption( optionId );
    }

}

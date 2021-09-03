/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';

@Component({
    selector: 'questionset-render-rating',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderrating.html',
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
    @Input() private imageWidthQuestion = 200;

    private ratingValuesHaveAlsoText = false;

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

    private onClick( optionId: string, $event ): boolean {
        return this.qp.clickAnswerOption( optionId, $event );
    }

    private isChecked( questionId: string, optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[questionId] && this.qp.answers[questionId].options && this.qp.answers[questionId].options[optionId];
    }

}

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
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionsetRenderRating extends QuestionsetRenderBasic implements OnInit {

    private ratingValuesHaveAlsoText = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {

        super.ngOnInit();

        // Is there any rating value with an alternative text?
        for ( let entry of this.questiontypeparameter.rating.entries ) {
            if( entry.text !== '' ) {
                this.ratingValuesHaveAlsoText = true;
                break;
            }
        }

    }

    private onClick( optionId: string, $event ): boolean {
        return this.qp.clickAnswerOption( optionId, $event );
    }

    private isChecked( questionId: string, optionId: string ): boolean {
        return this.qp.answers[questionId].options[optionId];
    }

}

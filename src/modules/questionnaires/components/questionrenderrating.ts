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
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionRenderRating extends QuestionRenderBasic implements OnInit {

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

    private onClick( optionId: string ): boolean {
        return this.questionnaireParticipation.clickAnswerOption( optionId );
    }

}

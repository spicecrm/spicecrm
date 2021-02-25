/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component({
    selector: 'question-render-nps',
    templateUrl: './src/modules/questionnaires/templates/questionrendernps.html',
    styles: [
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionRenderNPS extends QuestionRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {
        super.ngOnInit();
    }

    private onClick( score: number|string, $event ): boolean {
        $event.stopPropagation();
        score = score.toString();
        if ( score === this.qp.answers[this.questionId].optionlessAnswerValue ) score = '';
        return this.qp.setAnswerValue( this.questionId, score );
    }

    private isChecked( questionId: string, score: number ): boolean {
        return this.qp.answers[questionId].optionlessAnswerValue && this.qp.answers[questionId].optionlessAnswerValue == score;
    }

}

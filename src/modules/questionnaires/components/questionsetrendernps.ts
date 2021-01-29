/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionset-render-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsetrendernps.html',
    styles: [
        "table { border-top: none; }",
        "th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}",
        "tr:first-child td { border-top: none; }"
    ]
})
export class QuestionsetRenderNPS extends QuestionsetRenderBasic implements OnInit {

    private textForScore0;
    private textForScore10;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {
        super.ngOnInit();
        if ( this.questiontypeparameter.nps ) {
            this.textForScore0 = this.questiontypeparameter.nps.textForScore0;
            this.textForScore10 = this.questiontypeparameter.nps.textForScore10;
        }
    }

    private onClick( questionId: string, score: number|string, $event ): boolean {
        $event.stopPropagation();
        score = score.toString();
        if ( score === this.qp.answers[questionId].optionlessAnswerValue ) score = '';
        return this.qp.setAnswerValue( questionId, score );
    }

    private isChecked( questionId: string, score: number ): boolean {
        return this.qp.answers[questionId].optionlessAnswerValue && this.qp.answers[questionId].optionlessAnswerValue == score;
    }

}

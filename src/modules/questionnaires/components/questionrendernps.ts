/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
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

    private onClick( questionId: string, score: number ): boolean {
        return this.questionnaireParticipation.setAnswerValue( questionId, score.toString() );
    }

}

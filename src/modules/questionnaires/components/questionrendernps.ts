/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component({
    selector: 'question-render-nps',
    templateUrl: './src/modules/questionnaires/templates/questionrendernps.html',
    styles: [
        'table { border-top: none; }',
        'th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}',
        'tr:first-child td { border-top-width: 0; }',
        'td.question-hover:hover { background-color: #f3f2f2; }',
        'td { padding: 0.5rem 0.75rem }',
        'table.with-text-for-score th.th1 { border-bottom: none; }',
        'th.th2 { border-top: none; }'
    ]
})
export class QuestionRenderNPS extends QuestionRenderBasic implements OnInit {

    @Input() private hideFinishedQuestions = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {
        super.ngOnInit();
    }

    private onClick( score: number|string, $event ): boolean {
        $event.stopPropagation();
        score = score.toString();
        if ( score === this.qp.answers[this.questionId].answer_value ) score = '';
        return this.qp.setAnswerValue( this.questionId, score );
    }

    private isChecked( questionId: string, score: number ): boolean {
        return this.qp.answers[questionId].answer_value && this.qp.answers[questionId].answer_value == score;
    }

}

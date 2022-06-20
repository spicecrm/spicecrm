/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

declare var _;

@Component({
    selector: 'question-render-nps',
    templateUrl: '../templates/questionrendernps.html',
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

    @Input() public hideFinishedQuestions = false;

    public id = _.uniqueId();

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {
        super.ngOnInit();
    }

    /**
     * A click around the radio button happened.
     * @param score
     * @param $event
     */
    public clickAround( score: number|string, $event ): boolean {
        score = score.toString();
        if ( score === this.qp.answers[this.questionId].answer_value ) score = '';
        return this.qp.setAnswerValue( this.questionId, score.toString() );
    }

    /**
     * A click on a radio button (actually on the related label) has happened.
     * @param event
     */
    public clickOnLabel( score, event ) {
        let inputElement = event.target.parentElement.parentElement.firstChild; // or closest()
        if ( inputElement.checked ) {
            inputElement.checked = false;
            this.qp.setAnswerValue( this.questionId, null );
        } else {
            this.qp.setAnswerValue( this.questionId, score.toString() );
        }
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Has the radio button to be checked?
     * @param questionId
     * @param score
     */
    public isChecked( questionId: string, score: number ): boolean {
        return this.qp.answers[questionId].answer_value && this.qp.answers[questionId].answer_value == score;
    }

}

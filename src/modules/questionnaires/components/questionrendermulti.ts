/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component({
    selector: 'question-render-multi',
    templateUrl: '../templates/questionrendermulti.html',
    styles: [
        'table.question-render-question { border-collapse: collapse; }',
        'div.question-render-question:last-child { margin-bottom: 0; }',
        '.question-hover:hover { background-color: #f3f2f2; }',
        '.slds-table td, .slds-table th { white-space: initial; }'
    ]
})
export class QuestionRenderMulti extends QuestionRenderBasic implements OnInit {

    @Input() public hideFinishedQuestions = false;
    @Input() public imageWidthQuestion = 200;
    @Input() public imageWidthOption = 200;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Is the radio button of the quesion option selected?
     */
    public isChecked( optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[this.questionId] && this.qp.answers[this.questionId].options && this.qp.answers[this.questionId].options[optionId];
    }

    public setValue( optionId, value ) {
        this.qp.clickAnswerOption( optionId );
    }

    public getValue( optionId ): boolean {
        return this.qp.answers[this.questionId].options[optionId];
    }

}

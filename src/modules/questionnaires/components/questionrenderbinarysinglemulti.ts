/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-binary-single-multi',
    templateUrl: './src/modules/questionnaires/templates/questionrenderbinarysinglemulti.html',
    styles: [
        'table.question-render-question { border-collapse: collapse; }',
        'div.question-render-question { border-radius:0; margin-bottom: 1rem; }',
        'div.question-render-question:last-child { margin-bottom: 0; }',
        '.question-hover:hover { background-color: #f3f2f2; }'
    ]
})
export class QuestionRenderBinarySingleMulti extends QuestionRenderBasic implements OnInit {

    @Input() private hideFinishedQuestions = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Is the radio button of the quesion option selected?
     */
    private isChecked( optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[this.questionId] && this.qp.answers[this.questionId].options && this.qp.answers[this.questionId].options[optionId];
    }

}

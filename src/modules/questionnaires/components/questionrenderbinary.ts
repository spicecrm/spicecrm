/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-binary',
    templateUrl: '../templates/questionrenderbinary.html',
    styles: [
        'table.question-render-question { border-collapse: collapse; }',
        'div.question-render-question:last-child { margin-bottom: 0; }',
        '.question-hover:hover { background-color: #f3f2f2; }'
    ]
})
export class QuestionRenderBinary extends QuestionRenderBasic implements OnInit {

    @Input() public hideFinishedQuestions = false;

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

    get value(){
        try{
            for(let id in this.qp.answers[this.questionId].options){
                if(this.qp.answers[this.questionId].options[id]) return id;
            }
            return '';
        } catch(e){
            return '';
        }
    }

    set value( value) {
        if ( value === null ) this.qp.unsetAnswerOptions( this.questionId );
        else this.qp.clickAnswerOption(value);
    }

}

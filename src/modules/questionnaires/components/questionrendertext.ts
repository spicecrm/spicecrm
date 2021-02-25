/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-text',
    templateUrl: './src/modules/questionnaires/templates/questionrendertext.html',
    styles: [
        '.questionset-render .sequenced { font-family: monospace; }',
        '.questionset-render table.sequenced { margin: 0 0 0 auto; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
} )
export class QuestionRenderText extends QuestionRenderBasic implements OnInit {

    private lengthLongestSequence = 0;
    private questionNameSplitted: any[] = [];

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {

        super.ngOnInit();

        if ( this.questionMeta.parameter.sequenced ) {
            let i = 0;
            this.questionNameSplitted = this.question.name.split(',');
            if ( this.questionNameSplitted.length > this.lengthLongestSequence ) this.lengthLongestSequence = this.questionNameSplitted.length;
        }

    }

    private onTextChange(): boolean {
        return this.questionnaireParticipation.setAnswerValue( this.questionId, this.qp.answers[this.questionId].optionlessAnswerValue );
    }

    private forLoopArray( numElements: number ): any[] {
        return new Array(numElements);
    }

}



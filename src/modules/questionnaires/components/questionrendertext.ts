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

    private answerValue: string;

    private lengthLongestSequence = 0;
    private questionNamesSplitted: any[] = [];
    private sequenced = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {

        super.ngOnInit();

        if ( this.questiontypeparameter.text && this.questiontypeparameter.text.sequenced ) {
            this.sequenced = this.questiontypeparameter.text.sequenced;
            let i = 0;
            for ( let question of this.questionnaireParticipation.questionsArray[this.questionset.id] ) {
                this.questionNamesSplitted[i] = question.name.split(',');
                if ( this.questionNamesSplitted[i].length > this.lengthLongestSequence ) this.lengthLongestSequence = this.questionNamesSplitted[i].length;
                i++;
            }
        }

        this.answerValue = this.questionnaireParticipation.answers[this.questionId].optionlessAnswerValue;

    }

    private onTextChange(): boolean {
        return this.questionnaireParticipation.setAnswerValue( this.questionId, this.answerValue );
    }

    private forLoopArray( numElements: number ): any[] {
        return new Array(numElements);
    }

}



/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component( {
    selector: 'questionset-render-text',
    templateUrl: './src/modules/questionnaires/templates/questionsetrendertext.html',
    styles: [
        '.questionset-render .sequenced { font-family: monospace; }',
        '.questionset-render table.sequenced { margin: 0 0 0 auto; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
} )
export class QuestionsetRenderText extends QuestionsetRenderBasic implements OnInit {

    private lengthLongestSequence = 0;
    private questiontextSplitted: any[] = [];
    private sequenced = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {

        super.ngOnInit();

        if ( this.questiontypeparameter && this.questiontypeparameter.text && this.questiontypeparameter.text.sequenced ) {
            this.sequenced = this.questiontypeparameter.text.sequenced;
            let i = 0;
            for ( let question of this.qp.questionsArray[this.questionset.id] ) {
                this.questiontextSplitted[i] = question.questiontext.split(',');
                if ( this.questiontextSplitted[i].length > this.lengthLongestSequence ) this.lengthLongestSequence = this.questiontextSplitted[i].length;
                i++;
            }
        }

    }

    private onTextChange( questionId: string, event ): boolean {
        return this.qp.setAnswerValue( questionId, this.qp.answers[questionId].optionlessAnswerValue );
    }

    private forLoopArray( numElements: number ): any[] {
        return new Array(numElements);
    }

}

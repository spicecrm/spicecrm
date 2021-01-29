/**
 * @module ModuleQuestionnaires
 */
import { Component, Pipe, OnInit } from '@angular/core';
import { QuestionsetRenderBasic } from './questionsetrenderbasic';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Pipe({name: 'questiontypeisttextspipe'})
export class QuestionTypeISTTextPipe {

    private transform( value ): any[] {
        let retArray = [];
        let iteration = 0;
        let foundValue = true;

        while( iteration < 5 && value !== false ) {
            value = this.findNext(value, retArray, iteration);
            iteration++;
        }

        return retArray;
    }

    private findNext( value, items, iteration ): string|false {
        let nextPos = value.indexOf('?');
        if( nextPos >= 0 ) {
            if( nextPos > 0 ) {
                items.push({
                    type: 'text',
                    text: value.substring( 0, nextPos )
                });
            }

            items.push({
                type: 'option',
                index: iteration
            });

            return value.substring( nextPos + 1 );

        } else {
            items.push({
                type: 'text',
                text: value
            });
            return false;
        }
    }

}
@Pipe({name: 'questiontypeistoptionspipe'})
export class QuestionTypeISTOptionsPipe {
    private transform( values ) {
        if ( values ) return values.split(',');
        else return [];
    }
}

@Component( {
    selector: 'questionset-render-ist',
    templateUrl: './src/modules/questionnaires/templates/questionsetrenderist.html',
    styles: [ 'div.questionset-render-question:last-child { margin-bottom: 0 !important; }' ]
} )
export class QuestionsetRenderIST extends QuestionsetRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    private getAnswerValue( questionId: string, answerIndex: number ): string {
        try {
            let optionId = this.qp.questionoptionsArray[questionId][answerIndex].id;
            return this.qp.answers[questionId].options[optionId];
        } catch(e) {
            return '';
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    private onChange( questionId: string, answerIndex: number, $event: any ): boolean {
        $event.stopPropagation();
        let optionId = this.qp.questionoptionsArray[questionId][answerIndex].id;
        return this.qp.setOptionWithValue( optionId, $event.target.value );
    }

}

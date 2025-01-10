/**
 * @module ModuleQuestionnaires
 */
import { Component, Pipe, OnInit, Input } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Pipe({
    name: 'questiontypeisttextspipe'
})
export class QuestionTypeISTTextPipe {

    public transform( value ): any[] {
        let retArray = [];
        let iteration = 0;
        let foundValue = true;

        while( iteration < 5 && value !== false ) {
            value = this.findNext(value, retArray, iteration);
            iteration++;
        }

        return retArray;
    }

    public findNext( value, items, iteration ): string|false {
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
@Pipe({
    name: 'questiontypeistoptionspipe'
})
export class QuestionTypeISTOptionsPipe {
    public transform( values ) {
        if ( values ) return values.split(',');
        else return [];
    }
}

@Component({
    selector: 'question-render-ist',
    templateUrl: '../templates/questionrenderist.html',
    styles: [
        'div.question-render-question:last-child { margin-bottom: 0; }',
        'div.question-render-question { border-radius:0; }'
    ]
} )
export class QuestionRenderIST extends QuestionRenderBasic implements OnInit {

    @Input() public hideFinishedQuestions = false;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public getAnswerValue( answerIndex: number ): string {
        try {
            let optionId = this.qp.questionoptionsArray[this.questionId][answerIndex].id;
            return this.qp.answers[this.questionId].options[optionId];
        } catch(e) {
            return '';
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if ( !this.question.questiontext ) this.question.questiontext = this.question.name; // provisorisch, solange gefahr besteht, dass "questiontext" leer ist
    }

    public onChange( answerIndex: number, $event: any ): boolean {
        $event.stopPropagation();
        let optionId = this.qp.questionoptionsArray[this.questionId][answerIndex].id;
        return this.qp.setOptionWithValue( optionId, $event.target.value );
    }

    /**
     * Should the question rendered together with the following question?
     */
    public get isToMergeWithFollowingQuestion() {
        if ( this.followingQuestion && this.followingQuestion.questiontype === 'ist' ) return true;
        return false;
    }

}

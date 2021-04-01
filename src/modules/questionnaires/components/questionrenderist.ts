/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleQuestionnaires
 */
import { Component, Pipe, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

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
    selector: 'question-render-ist',
    templateUrl: './src/modules/questionnaires/templates/questionrenderist.html',
    styles: [
        'div.question-render-question:last-child { margin-bottom: 0; }',
        'div.question-render-question { border-radius:0; }'
    ]
} )
export class QuestionRenderIST extends QuestionRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    private getAnswerValue( answerIndex: number ): string {
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

    private onChange( answerIndex: number, $event: any ): boolean {
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

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
import { Component, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-text',
    templateUrl: './src/modules/questionnaires/templates/questionrendertext.html',
    styles: [
        '.questionset-render .sequenced { font-family: monospace; }',
        '.questionset-render table.sequenced { margin: 0 0 0 auto; }',
        // 'div.question-render-question:last-child { margin-bottom: 0 !important; }',
        'div.question-render-question { border-radius:0; }'
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

    /**
     * The CSS styling for the html element "box", in case the question is from type "binary".
     * The styling might be affected by a previous or following binary question.
     */
    private binaryTableStyle() {
        let style: any = {};
        /*
        if ( this.isToMergeWithPreviousQuestion ) {
            style['border-top'] = 'none';
        }

         */
        if ( this.isToMergeWithFollowingQuestion ) {
            style['border-bottom'] = 'none';
            style['margin-bottom'] = '-1rem';
        }
        return style;
    }

    /**
     * Should the question rendered together with the previous question?
     */
    /*
    public get isToMergeWithPreviousQuestion() {
        if ( this.questionMeta.parameter.sequenced
            && this.previousQuestion
            && this.previousQuestion.questiontype === 'text'
            && this.qp.questionsMeta[this.previousQuestion.id].parameter.sequenced
        ) {
            return true;
        }
        return false;
    }

     */

    /**
     * Should the question rendered together with the following question?
     */
    public get isToMergeWithFollowingQuestion() {
        if ( this.questionMeta.parameter.sequenced
            && this.followingQuestion
            && this.followingQuestion.questiontype === 'text'
            && this.qp.questionsMeta[this.followingQuestion.id].parameter.sequenced
        ) return true;
        return false;
    }

}



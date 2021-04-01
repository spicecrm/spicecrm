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

@Component({
    selector: 'question-render-nps',
    templateUrl: './src/modules/questionnaires/templates/questionrendernps.html',
    styles: [
        'table { border-top: none; }',
        'th { position: sticky; top: 0; border-top: 1px solid #dddbda; border-bottom: 1px solid #dddbda; z-index: 10;}',
        'tr:first-child td { border-top-width: 0; }',
        'td.question-hover:hover { background-color: #f3f2f2; }',
        'td { padding: 0.5rem 0.75rem }',
        'table.with-text-for-score th.th1 { border-bottom: none; }',
        'th.th2 { border-top: none; }'
    ]
})
export class QuestionRenderNPS extends QuestionRenderBasic implements OnInit {

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit() {
        super.ngOnInit();
    }

    private onClick( score: number|string, $event ): boolean {
        $event.stopPropagation();
        score = score.toString();
        if ( score === this.qp.answers[this.questionId].optionlessAnswerValue ) score = '';
        return this.qp.setAnswerValue( this.questionId, score );
    }

    private isChecked( questionId: string, score: number ): boolean {
        return this.qp.answers[questionId].optionlessAnswerValue && this.qp.answers[questionId].optionlessAnswerValue == score;
    }

}

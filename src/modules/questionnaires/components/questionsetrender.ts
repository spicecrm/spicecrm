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
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { helper } from '../../../services/helper.service';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { language } from '../../../services/language.service';

/**
* @ignore
*/
declare var _: any;

@Component( {
    selector: 'questionset-render',
    templateUrl: './src/modules/questionnaires/templates/questionsetrender.html',
    styles: [
        '.questionset-render.in-modal .questionset-render-header, .questionset-render.in-modal .questionset-render-footer { flex-grow: 0; flex-shrink: 0; }',
        '.questionset-render.in-modal .questionset-render-questions { flex-shrink: 1; flex-grow: 1; overflow-y: scroll; }',
        '.questionset-render.in-modal { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }',
        '.collapsed div.questionset-render-text { max-height: 4rem; overflow: hidden; }',
        '.questionset-render-textbefore-fadeout { display: none; background: linear-gradient(to bottom, rgba(243,242,242,0) 0%, rgba(243,242,242,1) 100%); height: 5rem; position: absolute; bottom: 0; left: 0; right: 0; padding: 0 1rem 1rem 1rem; border-radius: 0.25rem; }',
        '.collapsed div.questionset-render-textbefore-fadeout { display: block; }'
    ],
    providers: [helper]
} )
export class QuestionsetRender implements OnInit {

    private _ = _; // Workaround to use _ (underscore.js) inside the html template.

    public qp: questionnaireParticipationService;

    @Input() public questionsetId: string;

    public questionset: any;

    private textIsCollapsable = false;
    private textIsCollapsed = false;

    @ViewChild('box', {read: ElementRef, static: false}) private box: ElementRef;

    private isCompleteChange = new EventEmitter();

    constructor( private language: language, private questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit(): void {

        // window.setTimeout( () => { this.zeig = true; }, 5000 );
        this.questionset = this.questionnaireParticipation.questionnaire.questionsets[this.questionsetId];

        // setTimeout() is a workaround
        window.setTimeout( () => {
            if ( this.box && this.box.nativeElement.clientHeight > 64 ) this.textIsCollapsable = true;
        },1 );

    }

    private toggleText(): void {
        this.textIsCollapsed = !this.textIsCollapsed;
    }

    private get percentOfFinishedQuestions(): number {
        return this.questionnaireParticipation.percentOfFinishedQuestionsInQuestionset[this.questionsetId];
    }

    private get allQuestionsFinished(): number {
        return this.questionnaireParticipation.allQuestionsOfQuestionsetFinished[this.questionsetId];
    }

}

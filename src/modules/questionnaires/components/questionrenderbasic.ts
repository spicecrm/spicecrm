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
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

declare var _: any;

@Component({
    selector: 'questionset-render-basic',
    template: ''
})
export class QuestionRenderBasic implements OnInit {

    @Input() public questionId: string;

    /**
     * The object of the previous question in the rendering of the question set (in case there is any).
     */
    @Input() public previousQuestion: any;

    /**
     * The object of the following question in the rendering of the question set (in case there is any).
     */
    @Input() public followingQuestion: any;

    public questionMeta;

    public questionparameter;
    public question;
    public questionset;

    public qp: questionnaireParticipationService;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.questionMeta = this.qp.questionsMeta[this.questionId];
        this.question = this.qp.questions[this.questionId];
        this.questionset = this.question.parentQuestionset;
        // Use the question type parameter from the question, when not set there use it from the question set:
        this.questionparameter = !_.isEmpty( this.question.questionparameter ) ? this.question.questionparameter : this.questionset.questiontypeparameter;
    }

    private isDisabled(): boolean {
        return false; // todo!
        return this.questionMeta.readonly || this.qp.editMode === 'off';
    }

    public get hasTitleTextOrImage(): boolean {
        return !!( this.question.questiontext || this.question.image_id );
    }

    /**
     * Should the question rendered together with the following question?
     * Relevant only with questions of specific types
     */
    public get isToMergeWithFollowingQuestion() {
        if ( !this.hasTitleTextOrImage
            && this.followingQuestion
            && this.followingQuestion.questiontype === this.question.questiontype
        ) return true;
        return false;
    }

    /**
     * The CSS styling for the question html element, in case it is mergeable with the previous or following question.
     */
    public styleQuestionMerging() {
        let style = {};
        if ( this.isToMergeWithFollowingQuestion ) {
            style['margin-bottom'] = '-1rem';
            style['border-bottom'] = 'none';
        }
        return style;
    }

}

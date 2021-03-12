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



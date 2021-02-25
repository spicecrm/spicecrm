/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';
import { QuestionRenderBasic } from './questionrenderbasic';

@Component( {
    selector: 'question-render-binary-single-multi',
    templateUrl: './src/modules/questionnaires/templates/questionrenderbinarysinglemulti.html',
    styles: [
        'td.binary-left-text, td.binary-right-radio { border-right-width: 0; }',
        'td.binary-right-text, td.binary-left-radio { border-left-width: 0; }',
        'div.questionset-render-question:last-child { margin-bottom: 0 !important; }'
    ]
})
export class QuestionRenderBinarySingleMulti extends QuestionRenderBasic implements OnInit {

    /**
     * The object of the previous question in the rendering of the question set (in case there is any).
     */
    @Input() public previousQuestion: any;

    /**
     * The object of the following question in the rendering of the question set (in case there is any).
     */
    @Input() public followingQuestion: any;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        super( questionnaireParticipation );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Is the radio button of the quesion option selected?
     */
    private isChecked( optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[this.questionId] && this.qp.answers[this.questionId].options && this.qp.answers[this.questionId].options[optionId];
    }

    /**
     * Should the question rendered together with the previous question?
     * Relevant only with binary questions.
     */
    private get isToMergeWithPreviousQuestion() {
        if ( this.question.questiontype === 'binary' && !this.hasTitleTextOrImage
            && this.previousQuestion.questiontype === 'binary'
            && ( this.previousQuestion.questiontext.length === 0 && this.previousQuestion.image_id.length === 0 )
        ) return true;
        return false;
    }

    /**
     * Should the question rendered together with the following question?
     * Relevant only with binary questions.
     */
    private get isToMergeWithFollowingQuestion() {
        if ( this.question.questiontype === 'binary' && !this.hasTitleTextOrImage
            && this.followingQuestion.questiontype === 'binary'
            && ( this.followingQuestion.questiontext.length === 0 && this.followingQuestion.image_id.length === 0 )
        ) return true;
        return false;
    }

    /**
     * The CSS styling for the html element "box", in case the question is from type "binary".
     * The styling might be affected by a previous or following binary question.
     */
    private binaryBoxStyle() {
        let style = {};
        if ( this.isToMergeWithPreviousQuestion ) {
            style['border-top'] = 'none';
            style['padding-top'] = 0;
            style['border-radius'] = '0 0 0.25rem 0.25rem';
        }
        if ( this.isToMergeWithFollowingQuestion ) {
            style['border-bottom'] = 'none';
            style['padding-bottom'] = 0;
            style['border-radius'] = '0.25rem 0.25rem 0 0';
            style['margin-bottom'] = '-1rem !important';
        }
        return style;
    }

}

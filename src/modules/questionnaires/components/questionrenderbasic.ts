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

    public isDisabled(): boolean {
        return this.questionMeta.readonly || this.qp.editMode === 'off' || this.qp.editMode === 'postview';
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

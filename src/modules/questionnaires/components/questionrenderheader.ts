/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'question-render-header',
    templateUrl: '../templates/questionrenderheader.html'
})
export class QuestionRenderHeader implements OnInit {

    /**
     * The question for which to render the heading.
     */
    @Input() public question: any;

    /**
     * The object of the previous question in the rendering of the question set (in case there is any).
     */
    @Input() public previousQuestion: any;

    /**
     * The object of the following question in the rendering of the question set (in case there is any).
     */
    @Input() public followingQuestion: any;

    public questionMeta;

    @Input() public addclasses = '';

    @Input() public showError = false;

    public qp: questionnaireParticipationService;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.questionMeta = this.qp.questionsMeta[this.question.id];
    }

    public isDisabled(): boolean {
        return this.questionMeta.tempReadonly || this.qp.editMode === 'off' || this.qp.editMode === 'postview';
    }

    public get hasTitleTextOrImage(): boolean {
        return !!( this.question.questiontext || this.question.image_id );
    }

}

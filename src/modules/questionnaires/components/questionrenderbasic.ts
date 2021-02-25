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

}

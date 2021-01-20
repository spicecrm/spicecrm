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
    public questiontypeparameter;
    public question;
    public questionset;

    public qp: questionnaireParticipationService;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.questionMeta = this.qp.questionsMeta[this.questionId];
        // Use the question type parameter from the question, when not set there use it from the question set:
        this.questionset.questiontypeparameter = !_.isEmpty( this.question.questiontypeparameter ) ? this.question.questiontypeparameter : this.questiontypeparameter
        this.question = this.qp.questions[this.questionId];
        this.questionset = this.question.parentQuestionset;
    }

}

/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

@Component({
    selector: 'questionset-render-basic',
    template: ''
})
export class QuestionsetRenderBasic implements OnInit {

    @Input() public questionsetId: string;

    public questionset: any;
    public questionsMeta: any;

    public questiontypeparameter: any;

    public qp: questionnaireParticipationService;

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.questionset = this.qp.questionnaire.questionsets[this.questionsetId];
        this.questionsMeta = this.qp.questionsMeta;
        this.questiontypeparameter = this.questionset.questiontypeparameter;
    }

    public get allQuestionsOfQuestionsetFinished(): boolean {
        return this.qp.allQuestionsOfQuestionsetFinished[this.questionsetId];
    }

    public isDisabled( questionId: string ): boolean {
        return this.questionsMeta[questionId].tempReadonly || this.qp.editMode === 'off' || this.qp.editMode === 'postview';
    }

}

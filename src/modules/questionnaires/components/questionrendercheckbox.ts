/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

declare var _;

@Component({
    selector: 'question-render-checkbox',
    templateUrl: '../templates/questionrendercheckbox.html'
})
export class QuestionRenderCheckbox implements OnInit {

    /**
     * The question option for which to render the radio button.
     */
    @Input() public option: any;
j
    public questionMeta;

    public qp: questionnaireParticipationService;

    public id = _.uniqueId();

    constructor( public questionnaireParticipation: questionnaireParticipationService ) {
        this.qp = questionnaireParticipation;
    }

    public ngOnInit() {
        this.questionMeta = this.qp.questionsMeta[this.option.parentQuestion.id];
    }

    public isDisabled(): boolean {
        return this.questionMeta.readonly || this.qp.editMode === 'off' || this.qp.editMode === 'postview';
    }

    /**
     * Is the radio button of the quesion option selected?
     */
    public isChecked( optionId: string ): boolean {
        return this.qp.answers && this.qp.answers[this.option.parentQuestion.id]
            && this.qp.answers[this.option.parentQuestion.id].options
            && this.qp.answers[this.option.parentQuestion.id].options[optionId];
    }

}

/**
 * @module ModuleQuestionnaires
 */
import { Component, Input, OnInit } from '@angular/core';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

declare var _;

@Component({
    selector: 'question-render-radio-button',
    templateUrl: '../templates/questionrenderradiobutton.html',
    styles: [':host {line-height:0;display:inline-block;}']
})
export class QuestionRenderRadioButton implements OnInit {

    public _ = _; // Workaround to use _ (underscore.js) inside the html template.

    /**
     * The question option for which to render the radio button.
     */
    @Input() public option: any;

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
        return this.questionMeta.tempReadonly || this.qp.editMode === 'off' || this.qp.editMode === 'postview';
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

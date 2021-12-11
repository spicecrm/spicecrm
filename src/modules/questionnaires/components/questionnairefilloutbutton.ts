import { Component } from '@angular/core';
import { model } from '../../../services/model.service';
import { modal } from '../../../services/modal.service';
import { language } from '../../../services/language.service';

@Component({
    selector: 'questionnaire-fill-out-button',
    templateUrl: '../templates/questionnairefilloutbutton.html'
})
export class QuestionnaireFillOutButton {

    public disabled = false;

    constructor( public language: language, public model: model, public modal: modal ) { }

    public execute() {
        this.modal.openModal('QuestionnaireFillOutModal').subscribe(modal => {
            // modal.instance.questionnaireId = this.model.getField('questionnaire_id');
            modal.instance.parentId = this.model.id;
            modal.instance.parentType = this.model.module;
        });
    }
}

/**
 * @module ModuleQuestionnaires
 */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';
import { modal } from "../../../services/modal.service";

@Component({
    selector: 'questionnaire-preview-button',
    templateUrl: './src/modules/questionnaires/templates/questionnairepreviewbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class QuestionnairePreviewButton {

    constructor( private language: language, private model: model, private router: Router, private footer: footer, private modalservice: modal ) {
    }

    preview() {
        this.modalservice.openModal('QuestionnairePreview').subscribe(modal => {
            modal.instance['questionnaireId'] = this.model.id;
        });
    }

}
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
})
export class QuestionnairePreviewButton {

    constructor( private language: language, private model: model, private modalservice: modal ) { }

    public execute(): void {
        this.modalservice.openModal( 'QuestionnairePreview' ).subscribe( modal => modal.instance.questionnaireId = this.model.id );
    }

}

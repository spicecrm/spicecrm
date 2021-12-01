/**
 * @module ModuleQuestionnaires
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'questionset-preview-button',
    templateUrl: '../templates/questionsetpreviewbutton.html',
})
export class QuestionsetPreviewButton {

   constructor( public language: language, public model: model, public modalservice: modal ) { }

    public execute(): void {
        this.modalservice.openModal( 'QuestionsetPreview' ).subscribe( modal => modal.instance.questionsetIdOrObject = this.model.id );
    }

}

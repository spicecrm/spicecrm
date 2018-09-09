import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { footer } from '../../../services/footer.service';
import { language } from '../../../services/language.service';
import { modal } from '../../../services/modal.service';

@Component({
    selector: 'questionset-preview-button',
    templateUrl: './app/modules/questionnaires/templates/questionsetpreviewbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class QuestionsetPreviewButton {

   constructor( private language: language, private metadata: metadata, private model: model, private router: Router, private footer: footer, private modalservice: modal ) {
    }

    preview() {
        this.modalservice.openModal('QuestionsetPreview').subscribe(comp => {
            comp.instance['questionsetidorobject'] = this.model.id;
        });
    }

}
import {Component} from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { footer } from '../../services/footer.service';
import { language } from '../../services/language.service';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: './src/objectcomponents/templates/objectactionoutputbeanbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'openModal()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class ObjectActionOutputBeanButton {

    show_modal = false;

    constructor(
        private language: language,
        private model: model,
        private modal: modal,
    ) {

    }

    openModal(){
        //this.show_modal = true;
        this.modal.openModal('ObjectActionOutputBeanModal').subscribe(
            ref => {
                ref.instance.model = this.model;
            }
        );
    }

    closeModal()
    {
        //this.show_modal = false;
    }

}
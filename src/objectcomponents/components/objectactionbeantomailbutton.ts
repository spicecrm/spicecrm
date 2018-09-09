import {Component} from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { footer } from '../../services/footer.service';
import { language } from '../../services/language.service';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'object-action-beantomail-button',
    templateUrl: './src/objectcomponents/templates/objectactionbeantomailbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'displayMailModal()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class ObjectActionBeanToMailButton {

    showDialog: boolean = false;
    clickListener: any;

    constructor(
        private language: language,
        private modal: modal,
        private model: model,
    ) {

    }

    displayMailModal(){
        this.modal.openModal('ObjectActionMailModal').subscribe(
            popup => {
                popup.instance['parent'] = this.model;
            }
        );
    }

}
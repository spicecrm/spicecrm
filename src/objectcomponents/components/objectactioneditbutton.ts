import { Component } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-edit-button',
    templateUrl: './app/objectcomponents/templates/objectactioneditbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'this.editModel()',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class ObjectActionEditButton
{

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {

    }

    editModel(){
        this.model.edit();
    }

    getDisplay()
    {
        if(this.model.data.acl && !this.model.data.acl.edit)
            return 'none';

        return this.model.isEditing ? 'none' : 'inherit';
    }

}
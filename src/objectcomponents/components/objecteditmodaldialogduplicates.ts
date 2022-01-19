/**
 * @module ObjectComponents
 */

import {
    Component,
    Input,
    OnInit

} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-edit-modal-dialog-duplicates',
    templateUrl: '../templates/objecteditmodaldialogduplicates.html'
})
export class ObjectEditModalDialogDuplicates implements OnInit {

    @Input() module: string = '';
    @Input() duplicates: Array<any> = [];
    fieldset: String = '';

    constructor(public model: model, public metadata: metadata, public language: language) {

    }

    ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('GlobalModalDialogDuplicates', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }
}

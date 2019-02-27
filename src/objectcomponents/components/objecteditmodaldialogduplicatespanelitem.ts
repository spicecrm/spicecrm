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
    selector: 'object-edit-modal-dialog-duplicates-panel-item',
    templateUrl: './src/objectcomponents/templates/objecteditmodaldialogduplicatespanelitem.html'
})
export class ObjectEditModalDialogDuplicatesPanelItem {

    @Input() private itemmodule: string = '';
    @Input() private itemdata: any;
    @Input() private fieldset: string = '';

    private expanded: boolean = false;

    constructor(private model: model, private metadata: metadata, private language: language) {

    }
}

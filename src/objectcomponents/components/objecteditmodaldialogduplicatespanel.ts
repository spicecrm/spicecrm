/**
 * @module ObjectComponents
 */
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-edit-modal-dialog-duplicates-panel',
    templateUrl: './src/objectcomponents/templates/objecteditmodaldialogduplicatespanel.html',
    providers: [view]
})
export class ObjectEditModalDialogDuplicatesPanel implements OnInit {

    /**
     * an output when the panel emits that it shopudl be closed
     */
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * holds the fieldset for the fields to be displayed in the item. This is determined when the component is initialized from the component configuration
     */
    private fieldset: string = '';

    constructor(private model: model, private metadata: metadata, private language: language, private view: view) {
        this.view.isEditable = false;
    }

    /**
     * initializes and loads the fieldset
     */
    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('GlobalModalDialogDuplicates', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    /**
     * private handler for the close button that emits that the panel should close
     */
    private hidePanel(){
        this.close.emit(true);
    }
}
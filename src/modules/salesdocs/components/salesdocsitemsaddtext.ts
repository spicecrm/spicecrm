/**
 * @module ModuleSalesDocs
 */
import {
    Component,
    EventEmitter,
    Output
} from '@angular/core';


import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddtext.html',
    providers: [view, model]
})
export class SalesDocsItemsAddText {

    /**
     * reference to self for the modal
     */
    private self: any;


    private fieldset: string = '';

    /**
     * event emitter so the add process can subscribe
     */
    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private language: language, private model: model, private view: view) {
        // prepare the model
        this.model.module = 'SalesDocItems';
        this.model.initialize();

        // set the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // determine the fieldset for the component
        this.fieldset = this.metadata.getComponentConfig('SalesDocsItemsAddText', this.model.module).fieldset;
    }

    /**
     * closes the modal and emits false
     */
    private close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    /**
     * adds the text item and closes the modal
     */
    private add() {
        // check if valid and if yes save
        if (this.model.validate()) {
            // compose the items to be added
            let itemData = {
                name: this.model.getField('name'),
                description: this.model.getField('description'),
                acl: {
                    create: true,
                    edit: true
                }
            };

            this.additem.emit(itemData);

            // destroy the modal
            this.self.destroy();
        }
    }

}

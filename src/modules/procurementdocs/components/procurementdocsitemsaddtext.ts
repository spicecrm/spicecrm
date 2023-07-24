/**
 * @module ModuleProcurementDocs
 */
import {Component, EventEmitter, Output} from '@angular/core';


import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'procurement-docs-items-add-test',
    templateUrl: '../templates/procurementdocsitemsaddtext.html',
    providers: [view, model]
})
export class ProcurementDocsItemsAddText {

    /**
     * reference to self for the modal
     */
    public self: any;


    public fieldset: string = '';

    /**
     * event emitter so the add process can subscribe
     */
    @Output() public additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(public metadata: metadata, public language: language, public model: model, public view: view) {
        // prepare the model
        this.model.module = 'ProcurementDocItems';
        this.model.initialize();

        // set the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // determine the fieldset for the component
        this.fieldset = this.metadata.getComponentConfig('ProcurementDocsItemsAddText', this.model.module).fieldset;
    }

    /**
     * closes the modal and emits false
     */
    public close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    /**
     * adds the text item and closes the modal
     */
    public add() {
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

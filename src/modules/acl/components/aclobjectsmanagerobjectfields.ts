/**
 * @module ModuleACL
 */
import {
    Component, Injector,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {view} from "../../../services/view.service";

/**
 * manages the fisl control settings on an ACL Object
 */
@Component({
    selector: 'aclobjects-manager-object-fields',
    templateUrl: '../templates/aclobjectsmanagerobjectfields.html'
})
export class ACLObjectsManagerObjectFields {

    constructor(public modal: modal, public model: model, public view: view, public language: language, public injector: Injector) {

    }

    /**
     * a getter for the fields athat are defined
     */
    get fields() {
        let fieldsArray = [];

        let fields = this.model.getFieldValue('fieldcontrols');
        if (fields) {
            for (let field of fields) {
                fieldsArray.push(field);
            }
        }

        return fieldsArray;
    }

    /**
     * loads the field controls
     */
    get showFieldControls() {
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3';
    }

    /**
     * gets the field control set on the object
     *
     * @param field the name of the field
     */
    public getFieldControl(field) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                return thisfield.control;
            }
        }
        return '';
    }

    /**
     * sets the field control value
     *
     * @param field fieldname
     * @param event the event
     */
    public setFieldControl(field, event) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                thisfield.control = event.currentTarget.value;
            }
        }

    }

    /**
     * handles the rmoval fo a field
     *
     * @param field the name fo the field
     */
    public removeField(field) {
        let fields = this.model.getFieldValue('fieldcontrols');
        let i = 0;
        for (let thisfield of fields) {
            if (thisfield.field == field) {
                fields.splice(i, 1);
                this.model.setField('fieldcontrols', fields);
                return;
            }
            i++;
        }
    }

    /**
     * called to add a Field
     */
    public addField() {
        this.modal.openModal('ACLObjectsManagerObjectFieldsAdd', true, this.injector).subscribe(modalRef => {
            modalRef.instance.addfield.subscribe(field => {
                if (field) {
                    let currentfields = this.model.getFieldValue('fieldcontrols');
                    if(!currentfields.find(f => f.field == field)){
                        currentfields.push({spiceaclobject_id: this.model.id, field: field, control: 1});
                        this.model.setField('fieldcontrols', currentfields);
                    }
                }
            });
        });
    }
}

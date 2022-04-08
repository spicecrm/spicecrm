/**
 * @module ModuleACL
 */
import {
    Component,
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

/**
 * manages the fisl control settings on an ACL Object
 */
@Component({
    selector: 'aclobjects-manager-object-fields',
    templateUrl: '../templates/aclobjectsmanagerobjectfields.html'
})
export class ACLObjectsManagerObjectFields {

    constructor(public modal: modal, public model: model, public language: language) {

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
        let module = this.model.getFieldValue('spiceacltype_module');
        let currentFields = [];
        let fields = this.model.getFieldValue('fieldcontrols');
        for (let thisfield of fields) {
            currentFields.push({name: thisfield.field, id: thisfield.id});
        }

        this.modal.openModal('ACLTypesManagerTypesAddFields', true).subscribe(modalRef => {
            modalRef.instance.module = module;
            modalRef.instance.currentfields = currentFields;

            // set showAll so also links and noin-db fields are shown
            modalRef.instance.showAll = true;

            modalRef.instance.addfields.subscribe(fields => {
                if (fields) {
                    let currentfields = this.model.getFieldValue('fieldcontrols');

                    let newFields = [];

                    // check if fields are already in currentfields -> YES: let them like they are -> NO: add new field
                    for (let sfield of fields) {
                        let already_selected = false;
                        for (let key in currentfields) {
                            if(currentfields[key].field == sfield) {
                                already_selected = true;
                                newFields.push(currentfields[key]);
                            }
                        }
                        if(!already_selected) {
                            newFields.push({spiceaclobject_id: this.model.id, field: sfield, control: 1});
                        }
                    }
                    currentfields = newFields;
                    this.model.setField('fieldcontrols', currentfields);
                }
            });
        });
    }
}

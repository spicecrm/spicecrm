/**
 * @module ModuleACLTerritories
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'aclobjects-manager-object-territories',
    templateUrl: '../templates/aclobjectsmanagerobjectterritories.html'
})
export class ACLObjectsManagerObjectTerritories {

    public elements: any[] = [];
    public elementvalues: any[] = [];

    constructor(public backend: backend, public metadata: metadata, public model: model, public language: language, public modal: modal) {
        this.loadTerritories();
    }

    public loadTerritories() {
        this.backend.getRequest('module/SpiceACLTerritories/core/territorytypes/bymodule/'+this.model.getFieldValue('spiceacltype_module')).subscribe(territoryData => {
            this.elements = territoryData.elements;
            this.elementvalues = territoryData.elementvalues;
        });
    }

    public getValue(id) {
        let values = this.model.getFieldValue('territoryelementvalues');
        for(let value of values) {
            if(value.spiceaclterritoryelement_id == id) {
                let parsedValue = JSON.parse(value.value);
                return parsedValue.join(', ');
            }
        }
        return '';
    }

    public setValue(id) {

        // gather available values
        let availableValues = [{value: '*', description:'*'}];
        for(let elementvalue of this.elementvalues) {
            if(elementvalue.spiceaclterritoryelement_id == id) {
                availableValues.push({
                    value: elementvalue.elementvalue,
                    description: elementvalue.elementdescription,
                });
            }
        }

        // get the value
        let currentValues = [];
        let values = this.model.getFieldValue('territoryelementvalues');
        for(let value of values) {
            if(value.spiceaclterritoryelement_id == id) {
                currentValues = JSON.parse(value.value);
            }
        }

        this.modal.openModal('ACLObjectsManagerObjectTerritoriesModal').subscribe(modalRef => {
            modalRef.instance.availableValues = availableValues;
            modalRef.instance.currentValues = currentValues;
            modalRef.instance.setValues.subscribe(setValues => {
                let valueSet = false;
                let values = this.model.getFieldValue('territoryelementvalues');
                for(let value of values) {
                    if(value.spiceaclterritoryelement_id == id) {
                        value.value = JSON.stringify(setValues);
                        valueSet = true;
                    }
                }
                // if value was not found yet ... add it
                if(!valueSet) {
                    values.push({
                        spiceaclobject_id: this.model.id,
                        spiceaclterritoryelement_id: id,
                        value: JSON.stringify(setValues)
                    });
                }

                this.model.setField('territoryelementvalues', values);
            });
        });
    }

    get disabled() {
        return this.model.getFieldValue('status') == 'r';
    }

}

/**
 * @module ModuleACL
 */
import {
    Component
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    selector: 'aclobjects-manager-object-fieldvalues',
    templateUrl: '../templates/aclobjectsmanagerobjectfieldvalues.html',
    providers: [view]
})
export class ACLObjectsManagerObjectFieldvalues {

    public fields: any[] = [];
    public fieldset: string = '';
    public loadedtype: string = '';

    constructor(public backend: backend, public view: view, public metadata: metadata, public model: model, public language: language, public modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.handleType();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectFieldvalues', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    public handleType() {
        let aclTypeId = this.model.getFieldValue('sysmodule_id');
        if (aclTypeId && this.loadedtype != aclTypeId) {
            this.loadedtype = aclTypeId;
            // get the fields
            this.backend.getRequest('module/SpiceACLObjects/modules/' + aclTypeId).subscribe(typedata => {
                this.fields = typedata.authtypefields;
            });
        }
    }

    public getFieldValue(field, valueid) {
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    return fieldvalue[field];
                }
            }
        }

        return '';
    }

    public setFieldValue(field, valueid, eventtype, event) {
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    fieldvalue[field] = event.currentTarget.value;
                    return;
                }
            }
        }

        // not found .. add new object entry
        let newObject = {
            spiceaclobject_id: this.model.id,
            spiceaclmodulefield_id: valueid,
            operator: '',
            value1: '',
            value2: ''
        };
        newObject[field] = event.currentTarget.value;
        fieldValues.push(newObject);
    }

    public resetid(valueid) {
        let i = 0;
        let fieldValues = this.model.getFieldValue('fieldvalues');
        if (fieldValues && fieldValues.length > 0) {
            for (let fieldvalue of fieldValues) {
                if (fieldvalue.spiceaclmodulefield_id == valueid) {
                    fieldValues.splice(i, 1);
                    return;
                }
                i++;
            }
        }
    }

}

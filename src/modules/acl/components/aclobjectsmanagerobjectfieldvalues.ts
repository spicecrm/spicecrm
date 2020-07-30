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
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectfieldvalues.html',
    providers: [view]
})
export class ACLObjectsManagerObjectFieldvalues {

    private fields: any[] = [];
    private fieldset: string = '';
    private loadedtype: string = '';

    constructor(private backend: backend, private view: view, private metadata: metadata, private model: model, private language: language, private modelutilities: modelutilities) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.handleType();

        // get the config
        let componentconfig = this.metadata.getComponentConfig('ACLObjectsManagerObjectFieldvalues', 'SpiceACLObjects');
        this.fieldset = componentconfig.fieldset;
    }

    private handleType() {
        let aclTypeId = this.model.getFieldValue('sysmodule_id');
        if (aclTypeId && this.loadedtype != aclTypeId) {
            this.loadedtype = aclTypeId;
            // get the fields
            this.backend.getRequest('spiceaclobjects/authtypes/' + aclTypeId).subscribe(typedata => {
                this.fields = typedata.authtypefields;
            });
        }
    }

    private getFieldValue(field, valueid) {
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

    private setFieldValue(field, valueid, eventtype, event) {
        console.log(event);
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

    private resetid(valueid) {
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

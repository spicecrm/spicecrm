/**
 * @module ModuleACL
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter,
    Input,
    OnChanges,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {ACLTypesManagerTypesAddFields} from "./acltypesmanagertypesaddfields";

@Component({
    selector: 'aclobjects-manager-object-fields',
    templateUrl: './src/modules/acl/templates/aclobjectsmanagerobjectfields.html'
})
export class ACLObjectsManagerObjectFields {

    constructor(private backend: backend, private modal: modal, private metadata: metadata, private model: model, private language: language, private modelutilities: modelutilities) {

    }

    get fields(){
        let fieldsArray = [];

        let fields = this.model.getFieldValue('fieldcontrols');
        if(fields){
            for(let field of fields){
                fieldsArray.push(field);
            }
        }

        return fieldsArray;
    }

    get showFieldControls(){
        return this.model.getFieldValue('spiceaclobjecttype') == '0' || this.model.getFieldValue('spiceaclobjecttype') == '3'
    }

    getFieldControl(field) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for(let thisfield of fields){
            if(thisfield.field == field)
                return thisfield.control;
        }
        return '';
    }

    setFieldControl(field, event) {
        let fields = this.model.getFieldValue('fieldcontrols');
        for(let thisfield of fields){
            if(thisfield.field == field)
                thisfield.control = event.currentTarget.value;
        }

    }

    removeField(field){
        let fields = this.model.getFieldValue('fieldcontrols');
        let i = 0;
        for(let thisfield of fields){
            if(thisfield.field == field) {
                fields.splice(i, 1);
                this.model.setFieldValue('fieldcontrols', fields);
                return;
            }
            i++;
        }
    }

    addField(){
        let module = this.model.getFieldValue('spiceacltype_module');
        let currentFields = [];
        let fields = this.model.getFieldValue('fieldcontrols');
        for(let thisfield of fields){
           currentFields.push({name:thisfield.field});
        }

        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.module = module;
            modalRef.instance.currentfields = currentFields;
            modalRef.instance.addfield.subscribe(field => {
                if(field){
                    let currentfields = this.model.getFieldValue('fieldcontrols');
                    currentfields.push({spiceaclobject_id: this.model.id, field: field, control: 1});
                    this.model.setFieldValue('fieldcontrols', currentfields);
                }
            })
        });
    }

}
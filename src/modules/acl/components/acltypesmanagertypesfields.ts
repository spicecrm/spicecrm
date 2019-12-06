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
    Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-fields',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypesfields.html',
})
export class ACLTypesManagerTypesFields {

    @Input() authtypefields: Array<any> = [];
    @Input() authtypemodule: string = '';

    @Output() addfields: EventEmitter<any> = new EventEmitter<any>();
    @Output() deletefield: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {

    }

    addField(){

        //we want to hide every selected field (We can't add fields two times)
        for (let afield of this.authtypefields) {
            afield.hide = true;
        }
        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.module = this.authtypemodule;
            modalRef.instance.currentfields = this.authtypefields;
            modalRef.instance.addfields.subscribe(fields => {

                if (fields) {
                    let newFields = [];
                    for (let sfield of fields) {
                        let already_selected = false;
                        for (let key in this.authtypefields) {
                            if(this.authtypefields[key].name == sfield) {
                                already_selected = true;
                            }
                        }
                        if(!already_selected) {
                            newFields.push(sfield);
                        }
                    }
                    this.addfields.emit(newFields);
                }

            });
        });
    }

    deleteField(id){
        this.modal.confirm( 'LBL_DELETE_FIELD', 'LBLDELETE_FIELD' ).subscribe( ( answer ) => {
            if(answer){
                this.deletefield.emit(id);
            }
        });
    }

}
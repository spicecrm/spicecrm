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
    templateUrl: '../templates/acltypesmanagertypesfields.html',
})
export class ACLTypesManagerTypesFields {

    @Input() public authtypefields: any[] = [];
    @Input() public authtypemodule: string = '';

    @Output() public addfields: EventEmitter<any> = new EventEmitter<any>();
    @Output() public deletefield: EventEmitter<string> = new EventEmitter<string>();

    constructor(public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {

    }

    public addField() {

        // we want to hide every selected field (We can't add fields two times)
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

    public deleteField(id) {
        this.modal.confirm( this.language.getLabel('MSG_DELETE_ACL_FIELD', '', 'long'), this.language.getLabel('MSG_DELETE_ACL_FIELD', '', 'default') ).subscribe( ( answer ) => {
            if(answer) {
                this.deletefield.emit(id);
            }
        });
    }

}

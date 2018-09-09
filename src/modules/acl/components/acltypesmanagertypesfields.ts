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

    @Output() addfield: EventEmitter<string> = new EventEmitter<string>();
    @Output() deletefield: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {

    }

    addField(){
        this.modal.openModal('ACLTypesManagerTypesAddFields').subscribe(modalRef => {
            modalRef.instance.module = this.authtypemodule;
            modalRef.instance.currentfields = this.authtypefields;
            modalRef.instance.addfield.subscribe(addfield => {
                this.addfield.emit(addfield);
            })
        })
    }

    deleteField(id){
        this.modal.confirm( 'LBL_DELETE_FIELD', 'LBLDELETE_FIELD' ).subscribe( ( answer ) => {
            if(answer){
                this.deletefield.emit(id);
            }
        });
    }

}
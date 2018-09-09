import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter, Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-actions',
    templateUrl: './src/modules/acl/templates/acltypesmanagertypesactions.html',
})
export class ACLTypesManagerTypesActions {

    @Input() authtypeactions = [];

    @Output() addaction: EventEmitter<string> = new EventEmitter<string>();
    @Output() deleteaction: EventEmitter<string> = new EventEmitter<string>();

    constructor(private backend: backend, private modal: modal, private language: language, private modelutilities: modelutilities) {

    }

    addAction(){
        this.modal.openModal('ACLTypesManagerTypesAddAction').subscribe(modalRef => {
            modalRef.instance.currentactions = this.authtypeactions;
            modalRef.instance.addaction.subscribe(addaction => {
                this.addaction.emit(addaction);
            })
        })
    }

    deleteAction(id){
        this.modal.confirm( 'LBL_DELETE_ACTION', 'LBL_DELETE_ACTION' ).subscribe( ( answer ) => {
            if(answer){
                this.deleteaction.emit(id);
            }
        });
    }
}
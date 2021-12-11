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
    EventEmitter, Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    selector: 'acltypes-manager-types-actions',
    templateUrl: '../templates/acltypesmanagertypesactions.html',
})
export class ACLTypesManagerTypesActions {

    @Input() public authtypeactions = [];

    @Output() public addaction: EventEmitter<string> = new EventEmitter<string>();
    @Output() public deleteaction: EventEmitter<string> = new EventEmitter<string>();

    constructor(public backend: backend, public modal: modal, public language: language, public modelutilities: modelutilities) {

    }

    public addAction() {
        this.modal.openModal('ACLTypesManagerTypesAddAction', true).subscribe(modalRef => {
            modalRef.instance.currentactions = this.authtypeactions;
            modalRef.instance.addaction.subscribe(addaction => {
                this.addaction.emit(addaction);
            });
        });
    }

    public deleteAction(id) {
        this.modal.confirm( 'MSG_DELETE_ACL_ACTION', 'MSG_DELETE_ACL_ACTION' ).subscribe( ( answer ) => {
            if(answer) {
                this.deleteaction.emit(id);
            }
        });
    }
}

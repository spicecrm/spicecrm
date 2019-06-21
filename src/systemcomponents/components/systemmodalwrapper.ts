/**
 * @module SystemComponents
 */
import { ApplicationRef, Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { modal } from '../../services/modal.service';

@Component({
    selector: 'system-modal-wrapper',
    templateUrl: './src/systemcomponents/templates/systemmodalwrapper.html',
})
export class SystemModalWrapper implements OnDestroy {

    self: any = null;
    zIndex: number;

    childComponent: any;

    escKey: boolean = true;

    @ViewChild('target', {read: ViewContainerRef, static: false}) target: ViewContainerRef;

    constructor( private modalservice: modal, private application: ApplicationRef ) { }

    closeModal() {
        this.self.destroy();
    }

    ngOnDestroy() {
        this.modalservice.removeModal( this.self );
        this.application.tick(); // because events of the web speech api doesn´t trigger change detection
    }

    setEscKey( val: boolean = true ) {
        this.escKey = val;
    }

}
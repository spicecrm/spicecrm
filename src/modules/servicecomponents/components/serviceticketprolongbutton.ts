/**
 * @module ServiceComponentsModule
 */
import {Component, EventEmitter, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';

@Component({

    templateUrl: './src/modules/servicecomponents/templates/serviceticketprolongbutton.html'
})
export class ServiceTicketProlongButton implements OnInit {

    public disabled: boolean = true;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {
        this.modal.openModal('ServiceTicketProlongModal', true, this.viewContainerRef.injector);
    }

    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }

        let resolveDate = this.model.getField('resolve_date');
        if(resolveDate && resolveDate.isValid && resolveDate.isValid()){
            this.disabled = true;
            return;
        }

        this.disabled = mode == 'edit' ? true : false;
    }
}

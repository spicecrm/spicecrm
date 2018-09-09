import { Component, Input, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { modal } from '../../services/modal.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-auditlog-button',
    templateUrl: './app/objectcomponents/templates/objectactionauditlogbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)' : 'displayAuditLog()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class ObjectActionAuditlogButton {

    constructor( private language: language, private metadata: metadata, private model: model, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    displayAuditLog(){
        this.modal.openModal('ObjectActionAuditlogModal', true, this.ViewContainerRef.injector);
    }
}
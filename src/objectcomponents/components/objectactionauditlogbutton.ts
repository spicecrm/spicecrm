import {Component, EventEmitter, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-action-auditlog-button',
    templateUrl: './src/objectcomponents/templates/objectactionauditlogbutton.html'
})
export class ObjectActionAuditlogButton implements OnInit {

    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    public ngOnInit() {
        if (this.metadata.getModuleDefs(this.model.module).audited) {
            this.disabled = false;
        }
    }

    public execute() {
        this.modal.openModal('ObjectActionAuditlogModal', true, this.ViewContainerRef.injector);
    }
}

/**
 * @module ObjectComponents
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'object-action-auditlog-button',
    templateUrl: '../templates/objectactionauditlogbutton.html'
})
export class ObjectActionAuditlogButton implements OnInit {

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public disabled: boolean = true;

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public hidden: boolean = true;

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, public ViewContainerRef: ViewContainerRef) {
    }

    /**
     * checks if the module is audit enabled and if enables the button
     */
    public ngOnInit() {
        if (this.metadata.getModuleDefs(this.model.module).audited) {
            this.disabled = false;
            this.hidden = false;
        }
    }

    /**
     * the method to execute the button action
     */
    public execute() {
        this.modal.openModal('ObjectActionAuditlogModal', true, this.ViewContainerRef.injector);
    }
}

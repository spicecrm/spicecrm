/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Input, Output
} from '@angular/core';
import {Subject} from 'rxjs';

import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {modal} from '../../services/modal.service';
import {view} from "../../services/view.service";
import { model } from '../../services/model.service';
import { take } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: '[hl7-manager-rule]',
    templateUrl: '../templates/hl7managerrule.html',
    providers: [model, view],
    styles: [
        '.slds-is-selected td { background-color: transparent; border-width: 2px 2px 0 2px !important; padding-top:calc(0.25rem - 1px);}',
        '.slds-is-selected td.hl7-first-col { border-left:2px solid #e5e5e5; padding-left:calc(0.5rem - 2px)}',
        '.slds-is-selected td.hl7-last-col { border-right:2px solid #e5e5e5;padding-right:calc(0.5rem - 2px)}',
    ]
})
export class HL7ManagerRule {

    @Input() public rule: any;
    @Input() showDetails = false;

    public messageType: string;

    @Output() public toggleDetails = new EventEmitter<boolean>();
    // @Output() public toggleActive = new EventEmitter<boolean>();

    constructor( public backend: backend, public language: language, public view: view, public modal: modal, public model: model, public clipboard: Clipboard ) { }

    public ngOnInit() {
        this.view.isEditable = true;
        this.model.module = 'HL7Rules';
        this.model.id = this.rule.id;
        // this.model.initializeModel();
        this.model.setData( this.rule );
        this.view.setEditMode();
        this.model.startEdit();
    }

    public clickDetails() {
        this.toggleDetails.emit( !this.showDetails );
    }

    public clickActive() {
        // this.toggleActive( !this.rule.active );
    }

    public toggleActive( active: boolean ) {
        this.rule.active = active;
        this.model.setField('active', active );
        this.model.save(true);
        return;
    }

}

/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';

import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {relatedmodels} from "../../../services/relatedmodels.service";
import {backend} from "../../../services/backend.service";

import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {broadcast} from "../../../services/broadcast.service";
import {navigation} from "../../../services/navigation.service";


@Component({
    templateUrl: './src/modules/documents/templates/fielddocumentrevisionstatus.html'
})

export class fieldDocumentRevisionStatus extends fieldGeneric {
    private parent:any;
    constructor(public model: model, private navigation: navigation, view: view, public language: language, public metadata: metadata, public router: Router, public modal: modal, public relatedmodels: relatedmodels, public backend: backend) {
        super(model, view, language, metadata, router);

    }
    public ngOnInit() {
        super.ngOnInit();
        this.parent = this.navigation.getRegisteredModel(this.model.data.document_id, 'Documents');
    }

    /**
     * returns the translated value
     */
    public getValue(): string {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    /**
     * boolean to display the activation button
     */
    get canActivate(){
        return !this.model.isEditing && this.value == 'c' && this.model.checkAccess('edit') && this.parent.getField('status_id') != 'Expired';
    }

    /**
     * open prompt and update parent model when saving the current model
     */
    public activateRevision() {
        this.modal.prompt("confirm", this.language.getLabel('MSG_ACTIVATE_REVISION', '', 'long')).subscribe(
            answer => {
                if(answer) {
                    this.model.startEdit();
                    this.value = 'r';
                    this.model.save().subscribe( save => {
                        if(!this.parent) {
                            return;
                        }
                        this.parent.setField('revision', this.model.data.revision);
                    });
                }
            }
        );
    }
}

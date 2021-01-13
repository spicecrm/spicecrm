/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';

import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";


@Component({
    templateUrl: './src/modules/documents/templates/fielddocumentrevisionstatus.html'
})

export class fieldDocumentRevisionStatus extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * returns the translated value
     */
    public getValue(): string {
        return this.language.getFieldDisplayOptionValue(this.model.module, this.fieldname, this.value);
    }

    get canActivate(){
        return !this.model.isEditing && this.value == 'c' && this.model.checkAccess('edit');
    }

    private activateRevision() {
        this.model.startEdit();
        this.value = 'r';
        this.model.save();
    }
}

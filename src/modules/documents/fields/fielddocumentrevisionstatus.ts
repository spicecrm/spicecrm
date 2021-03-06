/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleCurrencies
 */
import {Component, EventEmitter, Output, SimpleChanges} from '@angular/core';
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
        this.subscriptions.add(
            this.parent.observeFieldChanges('status_id').subscribe(value => {
                if(value == 'Expired') {
                    this.value = 'a';
                }
            }));

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

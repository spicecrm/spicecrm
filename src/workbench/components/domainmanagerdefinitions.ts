/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * provides a list of the defined domain definitons .. part of the domain manager
 */
@Component({
    selector: 'domain-manager-definitions',
    templateUrl: './src/workbench/templates/domainmanagerdefinitions.html',
})
export class DomainManagerDefinitions {

    private definitionfilterterm: string;

    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast, private modal: modal, private injector: Injector) {

    }

    /**
     * returns the filtered definitions
     */
    get domaindefinitions() {
        return this.domainmanager.domaindefinitions.filter(d => {
            // no deleted
            if (d.deleted) return false;
            // match name if set
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0)) return false;
            // else return true
            return true;
        }).sort((a, b) => a.name > b.name ? 1 : -1);
    }


    private trackByFn(index, item) {
        return item.id;
    }


    private setCurrentDomainDefintion(definitionId: string) {
        this.domainmanager.currentDomainDefinition = definitionId;
        this.domainmanager.currentDomainField = null;
    }

    /**
     * react to the click to add a new domain definition
     */
    private addDomainDefinition(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddDefinitionModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain definition
     *
     * @param event
     * @param id
     */
    private deleteDomainDefinition(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.domainmanager.domaindefinitions.find(f => f.id == id).deleted = 1;

                for (let f of this.domainmanager.domainfields.filter(f => f.sysdomaindefinition_id == id)) {
                    f.deleted = 1;
                }

                if (this.domainmanager.currentDomainDefinition == id) {
                    this.domainmanager.currentDomainDefinition == null;
                    this.domainmanager.currentDomainField == null;
                }
            }
        });
    }

}

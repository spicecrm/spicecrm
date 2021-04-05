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
 * a table with the field in a domain. Enables also drag and drop to sequence and adding as well as removing fields
 */
@Component({
    selector: 'domain-manager-fields',
    templateUrl: './src/workbench/templates/domainmanagerfields.html',
})
export class DomainManagerFields {


    constructor(private domainmanager: domainmanager, private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities, private broadcast: broadcast, private toast: toast, private modal: modal, private injector: Injector) {

    }

    get domainfields() {
        let domainfields = this.domainmanager.domainfields.filter(f => f.deleted == 0 && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope == 'c');
        for (let domainfield of this.domainmanager.domainfields.filter(f => f.deleted == 0 && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition && f.scope != 'c')) {
            if (domainfields.findIndex(d => d.name == domainfield.name) == -1) {
                domainfields.push(domainfield);
            }
        }
        return domainfields.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }


    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    private drop(event) {
        // get the values and reshuffle
        let values = this.domainfields;
        let previousItem = values.splice(event.previousIndex, 1);
        values.splice(event.currentIndex, 0, previousItem[0]);

        // reindex the array resetting the sequence
        let i = 0;
        for (let item of values) {
            item.sequence = i;
            i++;
        }
    }


    /**
     * react to the click to add a new domain field
     */
    private addDomainField(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DomainManagerAddFieldModal', true, this.injector);
    }

    /**
     * prompts the user and delets the domain field
     *
     * @param event
     * @param id
     */
    private deleteDomainField(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.domainmanager.domainfields.find(f => f.id == id).deleted = 1;
                if (this.domainmanager.currentDomainField == id) {
                    this.domainmanager.currentDomainField == null;
                }
            }
        });
    }

    /**
     * customize the validation value
     *
     * @param e
     * @param validationValue
     */
    private customizeDomainField(e: MouseEvent, domainField) {
        e.stopPropagation();
        if (domainField.scope == 'g') {
            this.modal.prompt('confirm', 'Customize the Field?', 'Customize').subscribe(resp => {
                if (resp) {
                    let newValue = {...domainField};
                    newValue.id = this.modelutilities.generateGuid();
                    newValue.scope = 'c';
                    this.domainmanager.domainfields.push(newValue);
                    this.domainmanager.currentDomainField = newValue.id;
                }
            });
        }
    }

    /**
     * toggle the status
     * @param e
     * @param validationValue
     */
    private setStatus(e: MouseEvent, validationValue) {
        e.stopPropagation();
        if (validationValue.status == 'd') {
            validationValue.status = 'a';
        } else if (validationValue.status == 'a') {
            validationValue.status = 'i';
        } else {
            validationValue.status = 'a';
        }
    }

    private trackByFn(index, item) {
        return item.id;
    }

}

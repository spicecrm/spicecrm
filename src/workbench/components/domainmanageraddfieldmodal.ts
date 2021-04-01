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
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {domainmanager} from '../services/domainmanager.service';

/**
 * a modal window to add a fields to a domain definition
 */
@Component({
    templateUrl: './src/workbench/templates/domainmanageraddfieldmodal.html',
})
export class DomainManagerAddFieldModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private domainfield: any = {
        name: '{sysdictionaryitems.name}',
        fieldtype: '',
        scope: 'g',
        required: 0,
        deleted: 0,
        status: 'd'
    };

    constructor(private domainmanager: domainmanager, private metadata: metadata, private modelutilities: modelutilities) {

    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        return this.domainfield.name && this.domainfield.dbtype && !this.domainmanager.domainfields.find(f => f.name == this.domainfield.name && f.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition);
    }

    /**
     * saves the modal
     */
    private save() {
        if(this.canSave) {

            // add the sequence that represents the number of items
            // todo ensure we renumber when we do this
            this.domainfield.sequence =  this.domainmanager.domainfields.filter(d => d.sysdomaindefinition_id == this.domainmanager.currentDomainDefinition).length;

            this.domainfield.id = this.modelutilities.generateGuid();
            this.domainfield.sysdomaindefinition_id = this.domainmanager.currentDomainDefinition;
            this.domainmanager.domainfields.push(this.domainfield);
            this.close();
        }
    }


}

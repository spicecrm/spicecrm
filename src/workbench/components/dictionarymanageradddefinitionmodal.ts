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
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition, DictionaryManagerMessage} from "../interfaces/dictionarymanager.interfaces";

@Component({
    templateUrl: './src/workbench/templates/dictionarymanageradddefinitionmodal.html',
})
export class DictionaryManagerAddDefinitionModal {

    /**
     * reference to the modal self
     */
    private self: any;

    /**
     * the domain definition
     */
    private dictionarydefinition: DictionaryDefinition;

    /**
     * messages collected
     * @private
     */
    private messages: DictionaryManagerMessage[] = [];

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private modelutilities: modelutilities) {
        this.dictionarydefinition = {
            id: this.modelutilities.generateGuid(),
            name: '',
            tablename: '',
            sysdictionary_type: 'module',
            scope: this.dictionarymanager.defaultScope,
            deleted: 0,
            status: 'd'
        };
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * returns the messages for a specific field
     * @param field
     * @private
     */
    private getMessages(field) {
        return this.messages.filter(m => m.field == field);
    }

    /**
     * check if we can save
     *
     * name and fieldtype are defined and name does not exists yet
     *
     */
    get canSave() {
        this.messages = [];

        if (!this.dictionarydefinition.name) {
            this.messages.push({field: 'name', message: 'name must be entered'});
        }

        if (!this.dictionarydefinition.sysdictionary_type) {
            this.messages.push({field: 'sysdictionary_type', message: 'type must be specified'});
        }

        if (this.dictionarydefinition.sysdictionary_type != 'template' && !this.dictionarydefinition.tablename) {
            this.messages.push({field: 'tablename', message: 'tablename must be entered'});
        }

        if (this.dictionarymanager.dictionarydefinitions.find(d => d.name == this.dictionarydefinition.name)) {
            this.messages.push({field: 'name', message: 'name exists already'});
        }

        if (this.dictionarydefinition.tablename && this.dictionarymanager.dictionarydefinitions.find(d => d.tablename == this.dictionarydefinition.tablename)) {
            this.messages.push({field: 'tablename', message: 'table exists already'});
        }

        if (this.dictionarydefinition.tablename && this.dictionarymanager.reservedWords.indexOf(this.dictionarydefinition.tablename.toUpperCase()) >= 0) {
            this.messages.push({field: 'tablename', message: 'tablename cannot be used (reserved word)'});
        }

        return this.messages.length == 0;
    }

    /**
     * saves the modal
     */
    private save() {
        if (this.canSave) {
            this.dictionarydefinition.id = this.modelutilities.generateGuid();
            this.dictionarymanager.dictionarydefinitions.push(this.dictionarydefinition);
            this.close();
        }
    }


}

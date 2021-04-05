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
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {DomainField} from "../interfaces/domainmanager.interfaces";


@Component({
    selector: 'dictionary-manager-fields',
    templateUrl: './src/workbench/templates/dictionarymanagerfields.html',
})
export class DictionaryManagerFields {

    /**
     * the curretn dictionaryitem
     */
    private dictionaryitem: DictionaryItem;


    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryitems(): DictionaryItem[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition);

    }

    /**
     * returns the fields for the domain
     *
     * @param domaindefinitionid
     * @private
     */
    private getDomainFields(domaindefinitionid: string, first: boolean = true): DomainField[] {
        let fields = this.dictionarymanager.domainfields.filter(df => df.sysdomaindefinition_id == domaindefinitionid && df.deleted == 0).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
        if (fields) {
            return first ? fields.slice(0, 1) : fields.slice(1);
        } else {
            return [];
        }
    }

    /**
     * return the name of the template
     *
     * @param dictionarydefinitionid
     * @private
     */
    private getRefDefinitionName(dictionarydefinitionid: string) {
        return dictionarydefinitionid != this.dictionarymanager.currentDictionaryDefinition ? this.dictionarymanager.dictionarydefinitions.find(d => d.id == dictionarydefinitionid)?.name : '';
    }

    /**
     * translate the field name
     *
     * @param fieldName
     * @param $dictionaryId
     */
    public translateDomainField(fieldName, dictionaryItem) {
        return fieldName.replace('{sysdictionaryitems.name}', dictionaryItem.name);
    }

}

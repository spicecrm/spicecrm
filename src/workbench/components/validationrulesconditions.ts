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
    Component,
    Input,
    OnInit,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'validationrules-conditions',
    templateUrl: './src/workbench/templates/validationrulesconditions.html',
})
export class ValidationRulesConditions implements OnInit
{
    @Input() data; // validation rule data
    comparator_options:any[] = [];
    fieldname_options:any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private utils: modelutilities,
    ) {

    }

    // @Inputs are only loaded here...???
    ngOnInit()
    {
        // get options...
        this.comparator_options = this.language.getDisplayOptions('comparators_dom', true);

        for(let opt in this.metadata.getModuleFields(this.data.module))
        {
            this.fieldname_options.push(opt);
        }
        //console.log(this.data,this.fieldname_options);

    }

    get conditions()
    {
        return this.data.conditions.filter((e) => {return e.deleted != 1});
    }

    addCondition()
    {
        return this.data.conditions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            _is_new_record: true,
        });
    }

    removeCondition(id)
    {
        let idx = this.data.conditions.findIndex((e) => {return e.id == id});
        if( this.data.conditions[idx]._is_new_record )
        {
            this.data.conditions.splice(idx,1);
        }
        else {
            this.data.conditions[idx].deleted = 1;
        }
        //console.log(this.data.conditions);
        return true;
    }

}

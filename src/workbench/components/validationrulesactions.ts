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
    selector: 'validationrules-actions',
    templateUrl: './src/workbench/templates/validationrulesactions.html',
})
export class ValidationRulesActions implements OnInit
{
    @Input() data; // validation rule data
    readonly action_options = [
        'set_value',
        'set_model_state',
        'set_stati',
        'set_message',
        'error',
        'warning',
        'notice',
        'hide',
        'show',
        'require',
    ];
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
        for(let opt in this.metadata.getModuleFields(this.data.module))
        {
            this.fieldname_options.push(opt);
        }
    }

    get actions()
    {
        return this.data.actions.filter((e) => {return e.deleted != 1});
    }

    addAction()
    {
        return this.data.actions.push({
            id: this.utils.generateGuid(),
            sysuimodelvalidation_id: this.data.id,
            _is_new_record: true,
        });
    }

    removeAction(id)
    {
        let idx = this.data.actions.findIndex((e) => {return e.id == id});
        if( this.data.actions[idx]._is_new_record )
        {
            this.data.actions.splice(idx,1);
        }
        else {
            this.data.actions[idx].deleted = 1;
        }
        return true;
        //return this.data.actions.splice(idx,1);
    }

}
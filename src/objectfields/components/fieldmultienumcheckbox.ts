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
 * @module ObjectFields
 */
import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-multienum-checkbox',
    templateUrl: './src/objectfields/templates/fieldmultienumcheckbox.html'
})
export class fieldMultienumCheckBox {

    @Input() fieldname = '';
    @Input() option: any = '';
    @Input() disabled: boolean = false;
    fieldid: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata) {
        this.fieldid = this.model.generateGuid();
    }

    getValueArray(): Array<any> {
        if (this.model.data[this.fieldname])
            return this.model.data[this.fieldname].substring(1, this.model.data[this.fieldname].length - 1).split('^,^');
        else
            return [];
    }

    get checked() {
        if (this.model.data[this.fieldname]) {
            let checked = false;
            if (this.model.data[this.fieldname] == this.option.value) checked = true;
            if (this.model.data[this.fieldname].indexOf('^' + this.option.value + '^') > -1) checked = true;
            return checked;
        }
        else
            return false;
    }


    set checked(value) {

        let valArray = this.getValueArray();

        let valIndex = valArray.indexOf(this.option.value);
        if (valIndex === -1) {
            valArray.push(this.option.value);
        } else {
            valArray.splice(valIndex, 1);
        }

        this.model.data[this.fieldname] = '^' + valArray.join('^,^') + '^';
    }
}

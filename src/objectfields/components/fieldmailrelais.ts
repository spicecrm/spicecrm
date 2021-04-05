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
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {fieldGeneric} from "./fieldgeneric";

@Component({
    selector: 'field-mail-relais',
    templateUrl: './src/objectfields/templates/fieldmailrelais.html'
})
export class fieldMailRelais extends fieldGeneric{
    options: Array<any> = [];
    loadingOptions: boolean = false;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend) {
        super(model, view, language, metadata, router);
    }

    getValue(){
        let optionsArray = this.getOptions();

        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].value == this.model.data[this.fieldname]) {
                return this.options[i].display;
            }
        }
    }

    getOptions(): Array<any>{
        if(!this.loadingOptions) {
            if (this.options.length > 0) {
                return this.options;
            } else {
                this.loadingOptions = true;
                this.backend.getRequest("campaigns/getMailRelais").subscribe((results: any) => {
                    this.options = results;
                    this.loadingOptions = false;
                    return this.options;
                });
            }
        }
    }

    get value(){
        return this.getValue();
    }

    getDisplay() {
        // not if editing
        if(this.model.data.acl && !this.model.data.acl.edit)
            return false;

        // only for email
        if(this.model.data.campaign_type !== 'Email')
            return false;

        // not if editing
        return this.model.isEditing ? false : true;
    }

    getEditDisplay() {
        // only for email
        if(this.model.data.campaign_type !== 'Email')
            return false;

        return true;
    }
}

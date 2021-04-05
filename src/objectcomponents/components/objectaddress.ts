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
 * @module ObjectComponents
 */
import { Component, Input, OnInit } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { footer } from '../../services/footer.service';
import { modelutilities } from '../../services/modelutilities.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-address',
    templateUrl: './src/objectcomponents/templates/objectaddress.html',
    providers: [model]
})
export class ObjectAddress implements OnInit{

    componentconfig: any = {};
    @Input() address: any = {};
    @Input() parent: any = {};
    @Input() fieldset: string = '';

    constructor( private language: language, private metadata: metadata, private model: model, private view: view, private modelutilities: modelutilities, private footer: footer) {
        this.model.module = 'Addresses';
    }

    ngOnInit(){
        this.model.id = this.address.id;
        this.model.data = this.modelutilities.backendModel2spice('Addresses', this.address);

        // see if we have a fieldset
        if(this.fieldset == undefined || this.fieldset == ''){
            let config = this.metadata.getComponentConfig('ObjectAddress', this.parent.module);
            if(config.fieldset != undefined || config.fieldset != '')
                this.fieldset = config.fieldset;
        }

    }

    deleteAddress(){
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = this.language.getLabel('LBL_DELETE_ADDRESS_TITLE', 'Addresses');
            componenRef.instance.message = this.language.getLabel('LBL_DELETE_ADDRESS_TEXT', 'Addresses');
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    this.model.data.deleted = true;
                }
            });
        });
    }

}

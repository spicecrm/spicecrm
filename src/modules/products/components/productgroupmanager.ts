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
 * @module ModuleProducts
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {productfinder} from "../services/productfinder.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    templateUrl: './src/modules/products/templates/productgroupmanager.html',
    providers: [productfinder, model]
})

export class ProductGroupManager {

    /**
     * the id of the currently selected group
     */
    private selectedGroupId: string;

    /**
     * the actionset
     */
    private actionSet: string = '';

    constructor(private language: language, private navigationtab: navigationtab, private metadata: metadata, private model: model) {
        this.model.module = 'ProductGroups';
        this.navigationtab.setTabInfo({displaymodule: 'ProductGroups', displayname: this.language.getLabel('LBL_PRODUCT_GROUP_MANAGER')})
        this.getActionSet();
    }

    /**
     * called in the contructor to get the actionset from the config
     */
    private getActionSet() {
        let conf = this.metadata.getComponentConfig('ProductGroupManager', 'ProductGroups');
        this.actionSet = conf && conf.actionset ? conf.actionset : '';
    }

    /**
     * fires when the selection changes
     *
     * @param data
     */
    private selectionChanged(data) {
        this.selectedGroupId = data.object.id;
    }
}

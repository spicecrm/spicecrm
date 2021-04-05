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
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {toast} from '../../../services/toast.service';
import {navigation} from '../../../services/navigation.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    templateUrl: './src/modules/products/templates/productgroupslongtextcodeassignments.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host >>> span {cursor:pointer;}'
    ]
})
export class ProductGroupsLongtextCodeAssignments {

    private dialogvisible: boolean = false;
    private assignedAttributes: any[] = [];
    public allAttributes: any[] = [];
    private selectedAttribute: string = '';
    private isLoading: boolean = false;

    constructor(private language: language, private model: model, private navigation: navigation, private backend: backend, private toast: toast) {

    }

    get addDisabled() {
        // check that we have a value
        if (!this.selectedAttribute) return true;

        // check that the value is not assigned already
        let attribfound = false;
        this.assignedAttributes.some(attribute => {
            if (attribute.id == this.selectedAttribute) {
                attribfound = true;
                return true;
            }
        });

        return attribfound;
    }

    private getDisplay() {
        if (this.model.data.acl && !this.model.data.acl.edit) {
            return 'none';
        }

        return this.model.isEditing ? 'none' : 'inherit';
    }

    private editDisable(productgroup_id) {
        return productgroup_id != this.model.id;
    }

    private showDialog() {
        // get the attributes
        this.assignedAttributes = [];
        this.isLoading = true;
        this.backend.getRequest('module/ProductGroups/' + this.model.id + '/productattributes/longtextgenerator').subscribe((attributes: any) => {

            // write the assigned attributes
            for (let attributeid in attributes.assignedattributes) {
                if (attributes.assignedattributes.hasOwnProperty(attributeid)) {
                    this.assignedAttributes.push(attributes.assignedattributes[attributeid]);
                }
            }
            this.assignedAttributes.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            // get all availabel attriobutes
            this.allAttributes = attributes.allattributes;
            this.allAttributes.sort((a, b) => {
                return a.name > b.name ? 1 : -1;
            });

            this.isLoading = false;
        });


        this.dialogvisible = true;
    }

    private hideDialog() {
        this.dialogvisible = false;
    }

    private save() {
        this.isLoading = true;
        let attributes = [];
        for (let attribute of this.assignedAttributes) {
            if (attribute.productgroup_id === this.model.id) {
                attributes.push({
                    id: attribute.id,
                    contentcode: attribute.contentcode,
                    contentcode2: attribute.contentcode2,
                    textpattern: attribute.textpattern,
                    sequence: attribute.sequence
                });
            }
        }
        this.backend.postRequest('module/ProductGroups/' + this.model.id + '/productattributes/longtextgenerator', {}, attributes).subscribe(response => {
            this.hideDialog();
            this.toast.sendToast('changes saved');
            this.isLoading = false;
        });
    }

    private addAttribute() {
        this.allAttributes.some(attribute => {
            if (attribute.id == this.selectedAttribute) {
                this.assignedAttributes.push({
                    id: attribute.id,
                    name: attribute.name,
                    contentcode: '',
                    contentcode2: '',
                    textpattern: '',
                    sequence: '',
                    productgroup_id: this.model.id,
                });
                return true;
            }
        });
    }

    private removeAttribute(attribute) {
        let foundindex = 0;

        this.assignedAttributes.some(thisAttribute => {
            if (thisAttribute.id == attribute.id) {
                this.assignedAttributes.splice(foundindex, 1);
                return true;
            }
            foundindex++;
        });

    }

}

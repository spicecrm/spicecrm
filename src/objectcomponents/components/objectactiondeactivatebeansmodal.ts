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
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit,
} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {NgModel} from "@angular/forms";


/**
 * renders a modal window to show all selected beans to select the active one
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectactiondeactivatebeansmodal.html',
    providers: [model]
})
export class ObjectActionDeactivateBeansModal implements OnInit {

    /**
     * the componentconfig that gets passed in when the modal is created
     */
    private componentconfig: any = {};


    /**
     * all selected beans
     */
    @Input() public selectedItems: any = [];

    /**
     * all selected beans
     */
    @Input() public module: any = [];

    /**
     * a reference to the modal itself so the modal can close itself
     */

    /**
     * show finish button to close modal
     */
    private showfinish: boolean = false;


    private self: any = {};
    private value: string = "";



    constructor(
        private language: language,
        private model: model,
        private metadata: metadata
    ) {}


    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectActionDeactivateBeansModal', this.model.module);
        this.value = this.selectedItems[0].id;
    }

    public fieldname(item) {
        return item[this.componentconfig.fieldname];
    }

    /**
     * destroy the component
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * Set the successor_id and the is_inactive-flag of the inactive beans
     */
    private select() {
        let itemcounter = 0;
        let save = 0;
        for (let item of this.selectedItems) {
            if (item.id != this.value) {
                item.successor_id = this.value;
                item.is_inactive = 1;

                this.model.reset();
                this.model.id = item.id;
                this.model.initialize();
                this.model.module = this.module;
                this.model.data = item;


                if (this.model.validate()) {

                    this.model.save().subscribe(
                    success => {
                            itemcounter++;
                            item.itemsaved = "deactivated";
                            if(itemcounter == this.selectedItems.length - 1) {
                                this.showfinish = true;
                            }
                        },
                    error => {
                            itemcounter++;
                            item.itemsaved = "error";
                            if(itemcounter == this.selectedItems.length - 1) {
                                this.showfinish = true;
                        }
                    });
                } else {
                    itemcounter++;
                }
            } else {
                itemcounter++;
            }
        }
    }
}

/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {configurationService} from '../../../services/configuration.service';


@Component({
    templateUrl: './src/modules/catalogs/templates/fieldcatalogs.html'
})
export class fieldCatalogs extends fieldGeneric {
    @Input() public fieldname: string = '';
    @Input() public fieldconfig: any = {};
    public fieldid: string = '';
    private filterKey: string = '';
    private items = [];
    private products = [];
    private lastLoadedTemplate: string = '';

    private is_loading_items = false;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private modal: modal,
        private configurationService: configurationService
    ) {
        super(model, view, language, metadata, router);

        // subscribe to the view to react to a change to edit mode
        this.view.mode$.subscribe(mode => {
            if (mode == 'edit') {
                for (let item of this.items) {
                    let quantity = 0;
                    let vitem = this.value.find(e => e.product_id == item.id);
                    if (vitem) {
                        quantity = parseInt(vitem.quantity, 10);
                        item.quantity = quantity;
                    }
                }
            }
        });
    }

    get filteredItems() {
        return this.filterKey.length == 0 ? this.items : this.items.filter(item => item.name.toLowerCase().includes(this.filterKey.toLowerCase()));
    }

    /**
     * loads products of the given product group and adds them if they are missing.
     */
    public ngOnInit() {
        this.products = this.configurationService.getData('catalogs');

        this.model.data$.subscribe(data => {
            this.setItemsFromValue();
        });

        this.is_loading_items = false;

        if (this.fieldconfig && this.fieldconfig.fieldname_for_template) {
            let current_val = this.model.data[this.fieldconfig.fieldname_for_template];
            this.model.data$.subscribe(
                data => {
                    let new_val = data[this.fieldconfig.fieldname_for_template];
                    if (new_val && new_val.id) {
                        new_val = new_val.id;
                    }

                    if (current_val != new_val && this.view.isEditMode()) {
                        this.loadDefaultProductSetupByTemplate(new_val);
                        current_val = new_val;
                    }
                }
            );
        }

    }

    private setItemsFromValue() {
        if (this.items.length > 0) return;

        if (!Array.isArray(this.value)) {
            this.value = [];
        }
        for (let id in this.products) {
            let product = this.products[id];
            let quantity = 0;
            let vitem = this.value.find(e => e.product_id == product.id);
            if (vitem) {
                quantity = parseInt(vitem.quantity, 10);
            }
            if (quantity > 0 || product.product_status == "active") {
                this.items.push({
                    id: product.id,
                    external_id: product.external_id,
                    name: product.name,
                    quantity: quantity,
                    active: product.product_status == "active"
                });
            }
        }
        this.items.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
    }

    /*
    * converts the array of items into an array of values (only items with a quantity should be saved)
    */
    public convertItemsToValue() {
        if (!Array.isArray(this.value)) {
            this.value = [];
        }

        for (let item of this.items) {
            let vidx = this.value.findIndex(e => e.product_id == item.id);
            let vitem = this.value[vidx];
            if (item.quantity > 0) {
                if (!vitem) {
                    this.value.push({product_id: item.id, quantity: item.quantity});
                } else {
                    vitem.quantity = item.quantity;
                }
            } else {
                if (vitem) {
                    this.value.splice(vidx, 1);
                }
            }
        }
    }

    public getItemByProductID(id) {
        let item = this.products.find(e => e.id == id);
        return item ? item : {name: id};
    }

    public loadDefaultProductSetupByTemplate(id: string) {
        // only in case of change of template
        if ((this.model.isEditing || this.model.isNew) && id != this.lastLoadedTemplate) {
            this.lastLoadedTemplate = id;
            this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
                this.backend.getRequest(`module/OutputTemplates/${id}/related/products`).subscribe(
                    result => {
                        for (let id in result) {
                            if (result.hasOwnProperty(id)) {
                                let item = this.items.find(e => e.id == result[id].id);
                                if (item) {
                                    item.quantity = 1;
                                }
                            }
                        }
                        this.convertItemsToValue();

                        modalRef.instance.self.destroy();
                    },
                    err => {
                        console.error(err);
                        modalRef.instance.self.destroy();
                    }
                );
            });
        }
    }
}

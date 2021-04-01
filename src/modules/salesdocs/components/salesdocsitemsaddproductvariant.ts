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
 * @module ModuleSalesDocs
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    Output
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddproductvariant.html'
})
export class SalesDocsItemsAddProductVariant implements AfterViewInit {

    @ViewChild('productselector', {read: ViewContainerRef, static: true}) private productselector: ViewContainerRef;

    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    @Input() private items: any[] = [];

    private self: any = undefined;
    private parentitem_id: string = '';

    constructor(private metadata: metadata, private language: language, private backend: backend, private modal: modal) {

    }

    public ngAfterViewInit() {
        this.metadata.addComponent('ProductBrowser', this.productselector).subscribe(componentRef => {
            componentRef.instance.selectionchanged.subscribe(product => {
                this.productSelected(product);
            });
        });
    }

    private close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    private onModalEscX() {
        this.close();
    }

    private productSelected(productvariant) {
        if (productvariant.type == 'ProductVariant') {
            this.modal.openModal('SystemLoadingModal', false).subscribe(loadModal => {
                productvariant.object.getData(false).subscribe(data => {

                    // compose the items to be added
                    let itemData = {
                        parent_type: 'ProductVariants',
                        parent_id: productvariant.object.id,
                        productvariant_id: productvariant.object.id,
                        parent_name: productvariant.object.getField('name'),
                        productvariant_name: productvariant.object.getField('name'),
                        name: productvariant.object.getField('name'),
                        uom_id: productvariant.object.getField('base_uom_id'),
                        amount_net_per_uom: productvariant.object.getField('std_price'),
                        purchase_price: productvariant.object.getField('purchase_price'),
                        acl: {
                            create: true,
                            edit: true
                        }
                    };

                    this.additem.emit(itemData);

                    // destroy the laod modal
                    loadModal.instance.self.destroy();

                    // destroy the modal
                    this.self.destroy();
                });
            });
        }
    }
}

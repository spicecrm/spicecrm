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
import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {metadata} from "../../../services/metadata.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-brwoser-tree',
    templateUrl: './src/modules/products/templates/productbrowsertree.html'
})
export class ProductBrowserTree implements OnInit {

    @ViewChild('treeheader', {read: ViewContainerRef, static: true}) private treeheader: ViewContainerRef;
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    private productGroups: any[] = [];
    private productGroupTree: any[] = [];
    private productGroupTreeResultsOnly: boolean = false;
    private selectedId: string = '';
    private fieldset: string;

    constructor(private language: language,
                private backend: backend,
                private elementRef: ElementRef,
                private metadata: metadata,
                private productfinder: productfinder) {
        this.getProductGroups();
    }

    get treeStyle() {
        let rect = this.treeheader.element.nativeElement.getBoundingClientRect();
        return {height: `calc(100% - ${rect.height}px)`};
    }

    public ngOnInit(): void {
        const config = this.metadata.getComponentConfig('ProductBrowserTree', 'Products');
        this.fieldset = !!config && !!config.fieldset ? config.fieldset : undefined;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private getLinkTitle(productgroup) {
        return `${productgroup.summary_text}(${this.getAggregateCount(productgroup)})`;
    }

    private getProductGroups(parentId = '') {

        this.backend.getRequest('productgroups/tree' + (parentId ? '/' + parentId : '')).subscribe(items => {
            items.sort((a, b) => {
                return parseInt(a.sortseq, 10) > parseInt(b.sortseq, 10) ? 1 : -1;
            });

            for (let item of items) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'ProductGroup';
                item.member_count = parseInt(item.member_count, 10);
                item.product_count = parseInt(item.product_count, 10);
                this.productGroups.push(item);
            }

            this.buildTree();

            if (this.productfinder.searchfocus.type.length == 0) {
                this.selectGroup(this.productGroupTree[0]);
            }
        });
    }

    private getProducts(parentId = '') {
        this.backend.getRequest(`module/ProductGroups/${parentId}/Products`).subscribe(items => {
            for (let item of items.list) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'Product';
                item.parent_productgroup_id = parentId;
                this.productGroups.push(item);
            }
            this.buildTree();
        });
    }

    private canExpand(item) {
        return item.member_count > 0 || item.product_count > 0;
    }

    private toggle(productgroup) {
        this.productGroups.some(item => {
                if (item.id == productgroup.id) {
                    item.expanded = !item.expanded;
                    if (item.expanded) {
                        if (item.loaded) {
                            this.buildTree();
                        } else {
                            item.loaded = true;
                            if (item.member_count > 0) {
                                this.getProductGroups(productgroup.id);
                            } else {
                                this.getProducts(productgroup.id);
                            }
                        }
                    } else {
                        this.buildTree();
                    }
                    return true;
                }
            }
        );
    }

    private buildTree() {
        this.productGroupTree = [];
        this.addTreeNode();
    }

    private addTreeNode(parentId = '', level = 1) {
        for (let productgroup of this.productGroups) {
            if (productgroup.parent_productgroup_id == parentId) {
                productgroup.level = level;
                this.productGroupTree.push(productgroup);

                if (productgroup.type == 'ProductGroup' && productgroup.expanded) {
                    this.addTreeNode(productgroup.id, level + 1);
                }
            }
        }
    }

    private selectGroup(group) {
        let obj = {type: 'ProductGroup', object: group};
        this.productfinder.setSearchFocus(obj);
        this.selectedId = group.id;
        this.selectionchanged.emit(obj);
    }

    private selectProduct(product) {
        let obj = {type: 'Product', object: product};
        this.productfinder.setSearchFocus(obj);
        this.selectedId = product.id;
        this.selectionchanged.emit(obj);
    }

    private isSelected(id) {
        return this.selectedId == id;
    }

    private getAggregateCount(item) {
        let aggregate = item.type === 'Product' ? 'productid' : 'productgroups';
        return this.productfinder.getAggregateCount(aggregate, item.id);
    }

    private displayTreeNode(node) {
        return this.productGroupTreeResultsOnly ? this.getAggregateCount(node) !== '-' : true;
    }
}

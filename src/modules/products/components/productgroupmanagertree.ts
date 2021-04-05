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
import {
    Component,
    ElementRef,
    EventEmitter,
    OnDestroy,
    Output,
} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/* @ignore */
declare var _;

@Component({
    selector: 'product-group-manager-tree',
    templateUrl: './src/modules/products/templates/productgroupmanagertree.html'

})

export class ProductGroupManagerTree implements OnDestroy {

    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    private productGroups: any[] = [];
    private productGroupTree: any[] = [];
    private selectedId: string = '';
    private subscription: Subscription = new Subscription();
    private isLoading: string = '';
    private data: any = {};

    constructor(private language: language,
                private backend: backend,
                private elementRef: ElementRef,
                private broadcast: broadcast,
                private productfinder: productfinder) {
        this.subscribeModelChanges();
        this.getProductGroups();
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private subscribeModelChanges() {
        this.subscription = this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype == 'model.save' && msg.messagedata.module == 'ProductGroups') {
                let found = this.productGroups.some((group) => {
                    if (group.id == msg.messagedata.id) {
                        group.summary_text = msg.messagedata.data.summary_text;
                        group.sortseq = msg.messagedata.data.sortseq;
                        group.parent_productgroup_id = msg.messagedata.data.parent_productgroup_id;
                        this.productGroups.some(g => {
                            if (g.id == group.parent_productgroup_id) {
                                g.expanded = true;
                                g.member_count++;
                                return true;
                            }
                        });
                        return true;
                    }
                });
                if (!found) {
                    let newGroup = _.clone(msg.messagedata.data);
                    newGroup.expanded = false;
                    newGroup.loaded = false;
                    newGroup.type = 'ProductGroup';
                    this.productGroups.some(g => {
                        if (g.id == newGroup.parent_productgroup_id) {
                            g.expanded = true;
                            g.member_count++;
                            return true;
                        }
                    });
                    this.productGroups.push(newGroup);
                }
                this.buildTree();
            }
        });
    }

    private getProductGroups(parentId = '') {
        this.isLoading = parentId;
        this.backend.getRequest('productgroups/tree' + (parentId ? '/' + parentId : '')).subscribe(items => {
            for (let item of items) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'ProductGroup';
                item.member_count = parseInt(item.member_count, 10);
                item.product_count = parseInt(item.product_count, 10);
                this.productGroups.push(item);
            }
            this.buildTree();
            if (this.productfinder.searchfocus.type.length == 0 && this.productGroupTree.length > 0) {
                this.selectGroup(this.productGroupTree[0]);
            }
            this.isLoading = '';
        });

    }

    private sortProductGroups() {
        this.productGroups.sort((a, b) => {
            if (!isNaN(a.sortseq) && !isNaN(b.sortseq) && a.sortseq != b.sortseq) {
                return +a.sortseq > +b.sortseq ? 1 : -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }

    private toggle(productgroup, e) {
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
                            }
                        }
                    } else {
                        this.buildTree();
                    }
                    return true;
                }
            }
        );
        if (e.stopPropagation) e.stopPropagation();
    }

    private buildTree() {
        this.productGroupTree = [];
        this.sortProductGroups();
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

    private isSelected(id) {
        return this.selectedId == id;
    }
}

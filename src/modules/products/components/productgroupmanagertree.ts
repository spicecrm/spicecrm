import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';

@Component({
    selector: 'product-group-manager-tree',
    templateUrl: './src/modules/products/templates/productgroupmanagertree.html'
})

export class ProductGroupManagerTree {

    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    private productGroups: Array<any> = [];
    private productGroupTree: Array<any> = [];
    private selectedId: string = '';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.getProductGroups();
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private getProductGroups(parentId = '') {
        let fields = ['id', 'name', 'summary_text', 'parent_productgroup_id', 'member_count', 'product_count', 'sortparam', 'sortseq'];
        let searchfields = {
            field: 'parent_productgroup_id',
            operator: (parentId != '' ? '=' : 'empty'),
            value: parentId
        };
        let params = {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(fields),
            offset: 0,
            limit: 250
        };

        this.backend.getRequest('module/ProductGroups', params)
            .subscribe(items => {
                items.list.sort((a, b) => {
                    return parseInt(a.sortseq, 10) > parseInt(b.sortseq, 10) ? 1 : -1;
                });

                for (let item of items.list) {
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

    private isSelected(id) {
        return this.selectedId == id;
    }
}

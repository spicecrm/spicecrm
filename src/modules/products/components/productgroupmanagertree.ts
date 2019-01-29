import {Component, ElementRef, EventEmitter, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';
import {Subject} from 'rxjs';

@Component({
    selector: 'product-group-manager-tree',
    templateUrl: './src/modules/products/templates/productgroupmanagertree.html'
})

export class ProductGroupManagerTree {

    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    private productgroups: Array<any> = [];
    private productgrouptree: Array<any> = [];
    private selectedid: string = '';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.getProductGroups().subscribe(
            done => {
                if (this.productgrouptree.length > 0) {
                    this.selectGroup(this.productgrouptree[0]);
                }
            },
            complete => {
                if (this.productgrouptree.length > 0) {
                    this.selectGroup(this.productgrouptree[0]);
                }
            });

    }

    private getProductGroups(parentId = '') {
        let retSubject: Subject<any> = new Subject<any>();
        let searchfields = {
            field: 'parent_productgroup_id',
            operator: (parentId != '' ? '=' : 'empty'),
            value: parentId
        };

        let fields = ['id', 'name', 'summary_text', 'parent_productgroup_id', 'member_count', 'product_count', 'sortparam', 'sortseq'];
        this.backend.getRequest('module/ProductGroups', {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(fields),
            offset: 0,
            limit: 250
        }).subscribe(items => {

            items.list.sort((a, b) => {
                return parseInt(a.sortseq, 10) > parseInt(b.sortseq, 10) ? 1 : -1;
            });

            for (let item of items.list) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'group';
                item.member_count = parseInt(item.member_count, 10);
                item.product_count = parseInt(item.product_count, 10);
                this.productgroups.push(item);
            }
            this.buildTree();
            retSubject.next(true);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

    private canexpand(item) {
        return item.member_count > 0;
    }

    private toggle(productgroup) {
        this.productgroups.some(item => {
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
        this.productgrouptree = [];
        this.addTreeNode();
    }

    private addTreeNode(parentId = '', level = 1) {
        for (let productgroup of this.productgroups) {
            if (productgroup.parent_productgroup_id == parentId) {
                productgroup.level = level;
                this.productgrouptree.push(productgroup);

                if (productgroup.type == 'group' && productgroup.expanded) {
                    this.addTreeNode(productgroup.id, level + 1);
                }
            }
        }
    }

    private selectGroup(group) {
        this.productfinder.searchfocus = {
            type: 'ProductGroup',
            object: group
        };

        this.productfinder.getAttributes('productgroups', group.id, true).subscribe(status => {
            this.productfinder.getProductVariants();
        });

        this.selectedid = group.id;
        this.selectionchanged.emit(this.productfinder.searchfocus);
    }

    private isSelected(id) {
        return this.selectedid == id;
    }
}

/**
 * @module ModuleProducts
 */
import {Component, ElementRef, EventEmitter, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-brwoser-tree',
    templateUrl: './src/modules/products/templates/productbrowsertree.html'
})
export class ProductBrowserTree {

    @ViewChild('treeheader', {read: ViewContainerRef, static: false}) private treeheader: ViewContainerRef;
    @Output() private selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    private productGroups: any[] = [];
    private productGroupTree: any[] = [];
    private productGroupTreeResultsOnly: boolean = false;
    private selectedId: string = '';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.getProductGroups();
    }

    get treeStyle() {
        let rect = this.treeheader.element.nativeElement.getBoundingClientRect();
        return {height: `calc(100% - ${rect.height}px)`};
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private getLinkTitle(productgroup) {
        return `${productgroup.summary_text}(${this.getAggregateCount(productgroup)})`;
    }

    private getProductGroups(parentId = '') {
        let fields = ['id', 'name', 'summary_text', 'parent_productgroup_id', 'member_count', 'product_count', 'sortparam', 'sortseq'];
        let searchFields = {
            field: 'parent_productgroup_id',
            operator: (parentId != '' ? '=' : 'empty'),
            value: parentId
        };
        let params = {
            searchfields: JSON.stringify(searchFields),
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

    private getProducts(parentId = '') {
        let fields = ['id', 'name', 'summary_text'];
        let searchfields = {field: 'productgroup_id', operator: '=', value: parentId};
        let params = {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(fields),
            offset: 0,
            limit: 250,
            sortfield: 'name'
        };

        this.backend.getRequest('module/Products', params).subscribe(items => {
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

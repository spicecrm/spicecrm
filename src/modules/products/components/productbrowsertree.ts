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
    templateUrl: '../templates/productbrowsertree.html'
})
export class ProductBrowserTree implements OnInit {

    @ViewChild('treeheader', {read: ViewContainerRef, static: true}) public treeheader: ViewContainerRef;
    @Output() public selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    public productGroups: any[] = [];
    public productGroupTree: any[] = [];
    public productGroupTreeResultsOnly: boolean = false;
    public selectedId: string = '';
    public fieldset: string;

    constructor(public language: language,
                public backend: backend,
                public elementRef: ElementRef,
                public metadata: metadata,
                public productfinder: productfinder) {
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

    public trackByFn(index, item) {
        return item.id;
    }

    public getLinkTitle(productgroup) {
        return `${productgroup.summary_text}(${this.getAggregateCount(productgroup)})`;
    }

    public getProductGroups(parentId = '') {

        this.backend.getRequest('module/ProductGroups/tree' + (parentId ? '/' + parentId : '')).subscribe(items => {
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

    public getProducts(parentId = '') {
        this.backend.getRequest(`module/ProductGroups/${parentId}/products`).subscribe(items => {
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

    public canExpand(item) {
        return item.member_count > 0 || item.product_count > 0;
    }

    public toggle(productgroup) {
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

    public buildTree() {
        this.productGroupTree = [];
        this.addTreeNode();
    }

    public addTreeNode(parentId = '', level = 1) {
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

    public selectGroup(group) {
        let obj = {type: 'ProductGroup', object: group};
        this.productfinder.setSearchFocus(obj);
        this.selectedId = group.id;
        this.selectionchanged.emit(obj);
    }

    public selectProduct(product) {
        let obj = {type: 'Product', object: product};
        this.productfinder.setSearchFocus(obj);
        this.selectedId = product.id;
        this.selectionchanged.emit(obj);
    }

    public isSelected(id) {
        return this.selectedId == id;
    }

    public getAggregateCount(item) {
        let aggregate = item.type === 'Product' ? 'productid' : 'productgroups';
        return this.productfinder.getAggregateCount(aggregate, item.id);
    }

    public displayTreeNode(node) {
        return this.productGroupTreeResultsOnly ? this.getAggregateCount(node) !== '-' : true;
    }
}

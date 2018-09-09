import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {productfinder} from '../services/productfinder.service';

import {Subject, Observable} from 'rxjs';

declare var moment: any;

@Component({
    selector: 'product-brwoser-tree',
    templateUrl: './app/modules/products/templates/productbrowsertree.html'
})
export class ProductBrowserTree {

    @ViewChild('treeheader', {read: ViewContainerRef}) treeheader: ViewContainerRef;
    @Output() selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    productgroups: Array<any> = [];
    productgrouptree: Array<any> = [];
    productgrouptreeresultsonly: boolean = false;
    selectedid: string = '';

    constructor(private language: language, private backend: backend, private elementRef: ElementRef, private productfinder: productfinder) {
        this.getProductGroups().subscribe(
            done => {
                if (this.productgrouptree.length > 0)
                    this.selectGroup(this.productgrouptree[0]);
            },
            complete => {
                if (this.productgrouptree.length > 0)
                    this.selectGroup(this.productgrouptree[0]);
            })
    }

    get treestyle(){
        let rect = this.treeheader.element.nativeElement.getBoundingClientRect();
        return {
            height: 'calc(100% - ' + rect.height + 'px)'
        }
    }

    getProductGroups(parentId = '') {
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

            items['list'].sort((a, b) => {
                return parseInt(a.sortseq) > parseInt(b.sortseq) ? 1 : -1;
            });

            for (let item of items['list']) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'group';
                item.member_count = parseInt(item.member_count);
                item.product_count = parseInt(item.product_count);
                this.productgroups.push(item);
            }
            this.buildTree();
            retSubject.next(true);
            retSubject.complete();
        })
        return retSubject.asObservable();
    }

    getProducts(parentId = '') {
        let searchfields = {
            field: 'productgroup_id',
            operator: '=',
            value: parentId
        };

        let fields = ['id', 'name', 'summary_text'];
        this.backend.getRequest('module/Products', {
            searchfields: JSON.stringify(searchfields),
            fields: JSON.stringify(fields),
            offset: 0,
            limit: 250,
            sortfield: 'name'
        }).subscribe(items => {
            for (let item of items['list']) {
                item.expanded = false;
                item.loaded = false;
                item.type = 'product';
                item.parent_productgroup_id = parentId;
                this.productgroups.push(item);
            }
            this.buildTree();
        })
    }

    canexpand(item) {
        return item.member_count > 0 || item.product_count > 0;
    }

    toggle(productgroup) {
        this.productgroups.some(item => {
                if (item.id == productgroup.id) {
                    item.expanded = !item.expanded;
                    if (item.expanded) {
                        if (item.loaded) {
                            this.buildTree();
                        }
                        else {
                            item.loaded = true;
                            if (item.member_count > 0)
                                this.getProductGroups(productgroup.id);
                            else
                                this.getProducts(productgroup.id);
                        }
                    } else {
                        this.buildTree();
                    }
                    return true;
                }
            }
        )
    }

    buildTree() {
        this.productgrouptree = [];
        this.addTreeNode();
    }

    addTreeNode(parentId = '', level = 1) {
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

    selectGroup(group) {
        this.productfinder.searchfocus = {
            type: 'ProductGroup',
            object: group
        }

        this.productfinder.getAttributes('productgroups', group.id, true).subscribe(status => {
            this.productfinder.getProductVariants();
        })

        this.selectedid = group.id;

        // emit the selecion change
        this.selectionchanged.emit(this.productfinder.searchfocus);
    }

    selectProduct(product) {
        this.productfinder.searchfocus = {
            type: 'Product',
            object: product
        }
        this.productfinder.getAttributes('products', product.id, true).subscribe(status => {
            this.productfinder.getProductVariants();
        })
        // this.productbrowser.getProductVariants();
        this.selectedid = product.id;

        // emit the selecion change
        this.selectionchanged.emit(this.productfinder.searchfocus);
    }

    isSelected(id) {
        return this.selectedid == id;
    }

    getAggregateCount(item) {
        let aggregate = this.productfinder.getAggegateCount(item.type === 'product' ? 'productid' : 'productgroups', item.id);
        return aggregate ? aggregate : '-';
    }

    displayTreeNode(node){
        if(this.productgrouptreeresultsonly){
            return this.getAggregateCount(node) !== '-' ? true : false;
        } else {
            return true;
        }
    }
}
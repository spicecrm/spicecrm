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

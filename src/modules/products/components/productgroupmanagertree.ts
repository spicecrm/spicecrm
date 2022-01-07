/**
 * @module ModuleProducts
 */
import {
    Component,
    ElementRef,
    EventEmitter, Input,
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
    templateUrl: '../templates/productgroupmanagertree.html'

})

export class ProductGroupManagerTree implements OnDestroy {

    /**
     * an emitter when the selection changs
     * @private
     */
    @Output() public selectionchanged: EventEmitter<any> = new EventEmitter<any>();

    /**
     * an option to disable the productfinder that loads parameters when a group is selected
     *
     * @private
     */
    @Input() public productFinderActive: boolean = true;

    /**
     * the raw product groups retrieved in array list form
     * @private
     */
    public productGroups: any[] = [];

    /**
     * the prduct groups traversed into a tree structure
     *
     * @private
     */
    public productGroupTree: any[] = [];

    /**
     * the current selected id
     *
     * @private
     */
    public selectedId: string = '';

    /**
     * set to the current loading ID so wecan not load further nodes and also indicate which tree node is currently in loading state
     * @private
     */
    public isLoading: string = '';

    /**
     * any subscriptions the component might have to be unsubscribed whent he component is destroyed
     *
     * @private
     */
    public subscription: Subscription = new Subscription();

    constructor(public language: language,
                public backend: backend,
                public elementRef: ElementRef,
                public broadcast: broadcast,
                public productfinder: productfinder) {
        this.subscribeModelChanges();
        this.getProductGroups();
    }

    /**
     * make sure all subscriptions are destroyed
     */
    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * trackFn for the list to increase performance
     *
     * @param index
     * @param item
     * @private
     */
    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * subscribe to model changes that might occur
     *
     * @private
     */
    public subscribeModelChanges() {
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

    /**
     * retrieves the product groups for the treenode
     *
     * @param parentId
     * @private
     */
    public getProductGroups(parentId = '') {
        this.isLoading = parentId;
        this.backend.getRequest('module/ProductGroups/tree' + (parentId ? '/' + parentId : '')).subscribe(items => {
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

    /**
     * sorts the results
     *
     * @private
     */
    public sortProductGroups() {
        this.productGroups.sort((a, b) => {
            if (!isNaN(a.sortseq) && !isNaN(b.sortseq) && a.sortseq != b.sortseq) {
                return +a.sortseq > +b.sortseq ? 1 : -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }

    /**
     * toggle a node open or closed
     *
     * @param productgroup
     * @param e
     * @private
     */
    public toggle(productgroup, e) {
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

    /**
     * builds the tree from the array
     *
     * @private
     */
    public buildTree() {
        this.productGroupTree = [];
        this.sortProductGroups();
        this.addTreeNode();
    }

    /**
     * adds a tree node
     *
     * @param parentId
     * @param level
     * @private
     */
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

    /**
     * select a group
     * @param group
     * @private
     */
    public selectGroup(group) {
        // define the object type
        let obj = {type: 'ProductGroup', object: group};

        // set the data in the product finder
        if (this.productFinderActive) {
            this.productfinder.setSearchFocus(obj);
        }

        // set the selected id
        this.selectedId = group.id;

        // emit the change of selecttion
        this.selectionchanged.emit(obj);
    }

    /**
     * getter to highlight the selected entry in the tree
     *
     * @param id
     * @private
     */
    public isSelected(id) {
        return this.selectedId == id;
    }
}

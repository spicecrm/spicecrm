/**
 * @module ModuleSalesPlanning
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'sales-planning-tool-tree',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtooltree.html'
})

export class SalesPlanningToolTree implements OnInit {

    public nodeItems: any[] = [];
    public treeItems: any[] = [];
    public isLoading: string = '';
    public undoneonly: boolean = false;
    @Output() public selectNode: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language, private modal: modal, private backend: backend, private planningService: SalesPlanningService) {
    }

    get unDoneOnly() {
        return this.undoneonly;
    }

    /*
    * @set undoneOnly
    * @reset items & selection
    * @get nodeItems
    */
    set unDoneOnly(bool) {
        this.undoneonly = bool;
        this.resetData();
        this.getNodeItems();
    }

    public ngOnInit() {
        this.getNodeItems();
    }

    /*
    * @param parentId: string
    * @param item?: any
    * @set retrieveParams for next level
    * @push nodeItem to nodeItems
    * @build tree
    */
    private getNodeItems(parentId = '', item?) {
        this.isLoading = parentId.length == 0 ? '*' : parentId;
        this.planningService.setRetrieveParams(this.treeItems, item, true);
        let params = {
            pathArray: this.planningService.selectedNodesIds,
            characteristics: this.planningService.selectedCharacteristicIds,
            undoneOnly: this.unDoneOnly
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodesList`, params)
            .subscribe(nodeItems => {
                if (nodeItems) {
                    for (let item of nodeItems) {
                        item.expanded = false;
                        item.loaded = false;
                        item.parent_id = parentId;
                        this.nodeItems.push(item);
                    }
                    this.buildTree();
                    this.isLoading = '';
                }
            });
    }

    /*
    * @reset treeItems
    * @sort nodeItems
    * @add treeNode recursively
    */
    private buildTree() {
        this.treeItems = [];
        this.sortItems();
        this.addTreeNode();
    }

    /*
    * @sort nodeItems by (sortseq | name)
    */
    private sortItems() {
        this.nodeItems.sort((a, b) => {
            if (!isNaN(a.sortseq) && !isNaN(b.sortseq) && a.sortseq != b.sortseq) {
                return +a.sortseq > +b.sortseq ? 1 : -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }

    /*
    * @sort nodeItems by (sortseq | name)
    */
    private addTreeNode(parentId = '', level = 1) {
        for (let item of this.nodeItems) {
            if (item.parent_id == parentId) {
                item.level = level;
                this.treeItems.push(item);

                if (item.expanded) {
                    this.addTreeNode(item.id, level + 1);
                }
            }
        }
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return index;
    }

    /*
    * @confirm? change selected item
    * @set retrieveParams
    * @set selectedNode
    * @emit selectNode: void
    */
    private selectTreeItem(item) {
        this.treeItems.some(treeItem => {
            if (treeItem.id == item.id) {
                if (this.planningService.isEditing) {
                    this.modal.confirm(this.language.getLabel('MSG_NAVIGATIONSTOP', '', 'long'), this.language.getLabel('MSG_NAVIGATIONSTOP'), 'warning')
                        .subscribe(res => {
                            if (!res) return;
                            this.planningService.setRetrieveParams(this.treeItems, item);
                            this.planningService.selectedNode = item;
                            this.selectNode.emit();
                            return true;
                        });
                    return true;
                } else {
                    this.planningService.setRetrieveParams(this.treeItems, item);
                    this.planningService.selectedNode = item;
                    this.selectNode.emit();
                    return true;
                }
            }
        });
    }

    /*
    * @param treeItem: any
    * @param e: clickEvent
    * @build tree if item.expanded & loaded
    * @get nodeItems if item.expanded & not loaded
    * @set retrieveParams if item collapsed
    * @build tree if item collapsed
    * @stopPropagation e
    */
    private toggleOpen(treeItem, e) {
        this.nodeItems.some((item) => {
                if (item.id == treeItem.id) {
                    item.expanded = !item.expanded;
                    if (item.expanded) {
                        if (item.loaded) {
                            this.buildTree();
                        } else {
                            item.loaded = true;
                            if (treeItem.level < this.planningService.characteristics.length) {
                                this.getNodeItems(treeItem.id, treeItem);
                            }
                        }
                    } else {
                        this.planningService.setRetrieveParams(this.treeItems, item);
                        this.buildTree();
                    }
                    return true;
                }
            }
        );
        if (e.stopPropagation) e.stopPropagation();
    }

    /*
    * @param id: string
    * @return isSelected: boolean
    */
    private isSelected(id) {
        return this.planningService.selectedNode && this.planningService.selectedNode.id == id;
    }

    /*
    * @reset nodeItems
    * @reset treeItems
    * @reset selectedNode
    * @reset selectedNodes
    */
    private resetData() {
        this.nodeItems = [];
        this.treeItems = [];
        this.planningService.selectedNode = undefined;
        this.planningService.selectedNodes = [];
    }
}

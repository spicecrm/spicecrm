/**
 * @module ModuleSalesPlanning
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";

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

    constructor(private language: language, private backend: backend, private planningService: SalesPlanningService) {
    }

    get unDoneOnly() {
        return this.undoneonly;
    }

    set unDoneOnly(bool) {
        this.undoneonly = bool;
        this.resetData();
        this.getNodeItems();
    }

    public ngOnInit() {
        this.getNodeItems();
    }

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

    private buildTree() {
        this.treeItems = [];
        this.sortItems();
        this.addTreeNode();
    }

    private sortItems() {
        this.nodeItems.sort((a, b) => {
            if (!isNaN(a.sortseq) && !isNaN(b.sortseq) && a.sortseq != b.sortseq) {
                return +a.sortseq > +b.sortseq ? 1 : -1;
            } else {
                return a.name > b.name ? 1 : -1;
            }
        });
    }

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

    private trackByFn(index, item) {
        return index;
    }

    private selectTreeItem(item) {
        this.treeItems.some(treeItem => {
            if (treeItem.id == item.id) {
                this.planningService.setRetrieveParams(this.treeItems, item);
                this.planningService.selectedNode = item;
                this.selectNode.emit();
                return true;
            }
        });
    }

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

    private isSelected(id) {
        return this.planningService.selectedNode && this.planningService.selectedNode.id == id;
    }

    private resetData() {
        this.nodeItems = [];
        this.treeItems = [];
        this.planningService.selectedNode = undefined;
        this.planningService.selectedNodes = [];
    }
}

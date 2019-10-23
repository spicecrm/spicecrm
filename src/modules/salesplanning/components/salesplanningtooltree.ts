/**
 * @module ModuleSalesPlanning
 */
import {Component, OnInit} from '@angular/core';
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
    public unDoneOnly: boolean = false;

    constructor(private language: language, private backend: backend, private planningService: SalesPlanningService) {
    }

    public ngOnInit() {
        this.getNodeItems();
    }

    private getNodeItems(parentId = '', item?) {
        this.isLoading = parentId.length == 0 ? '*' : parentId;
        this.setRetrieveParams(item);
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
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

    private getNodes(node) {
        let nodes = [];
        if (node && node.value) nodes = [(node.value)];
        if (node && node.parent_id && node.parent_id.length > 0) {
            this.getNodeByParent(node.parent_id, nodes);
        }
        nodes.unshift('root');
        return nodes;
    }

    private getNodeByParent(parentId, nodes) {
        for (let item of this.nodeItems) {
            if (item.id == parentId) {
                nodes.unshift(item.value);
                this.getNodeByParent(item.parent_id, nodes);
            }
        }
    }

    private getCharacteristicLevels(characteristic) {
        return this.planningService.characteristics
            .filter((char, index) => index <= this.planningService.characteristics.map(c => c.id).indexOf(characteristic))
            .map(char => char.id);
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
                this.planningService.selectedNode = item;
                this.planningService.selectedNodes = this.getNodes(item);
                return true;
            }
        });
    }

    private toggle(treeItem, e) {
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
                        this.buildTree();
                    }
                    return true;
                }
            }
        );
        if (e.stopPropagation) e.stopPropagation();
    }

    private setRetrieveParams(item?) {
        let characteristic = item ? this.planningService.characteristics[item.level].id : this.planningService.characteristicTerritory;
        this.planningService.selectedCharacteristics = this.getCharacteristicLevels(characteristic);
        this.planningService.selectedNodes = this.getNodes(item);
    }

    private isSelected(id) {
        return this.planningService.selectedNode && this.planningService.selectedNode.id == id;
    }

    private toggleUndoneOnly() {
        this.unDoneOnly = !this.unDoneOnly;
        this.nodeItems = [];
        this.treeItems = [];
        this.planningService.selectedNode = undefined;
        this.planningService.selectedNodes = [];
        this.getNodeItems();
    }
}

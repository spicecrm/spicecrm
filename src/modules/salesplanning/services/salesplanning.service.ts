/**
 * @module ModuleSalesPlanning
 */
import {Injectable} from '@angular/core';

@Injectable()

export class SalesPlanningService {
    public versionId: string = '';
    public characteristicTerritory: string = '_territories';
    public characteristics: any[] = [];
    public selectedCharacteristics: any[] = [];
    public contentFields: any[] = [];
    public selectedNode: any;
    public selectedNodes: any[] = [];
    public isEditing: boolean = false;


    get selectedCharacteristicIds() {
        return this.selectedCharacteristics.map(char => char.id);
    }

    get selectedNodesIds() {
        return ['root', ...this.selectedNodes.map(node => node.value)];
    }

    /*
    * set the retrieve params (visited tree item & visited characteristics) for the get node content and the content list
    * @param originNodes: any[]
    * @param item?: any
    * @param nextLevel?: number
    * @set selectedNodes
    * @set selectedCharacteristics
    */
    public setRetrieveParams(originNodes, item?, nextLevel?) {
        let index = item ? nextLevel ? item.level +1 : item.level : 1;
        this.selectedCharacteristics = this.characteristics.slice(0, index);
        this.selectedNodes = this.getVisitedTreeItems(item, originNodes);
    }

    /*
    * @param item: any
    * @param originNodes: number
    * @return selectedNodes: array[]
    */
    private getVisitedTreeItems(item, originNodes) {
        let selectedNodes = [];
        if (item && item.value) selectedNodes = [(item)];
        if (item && item.parent_id && item.parent_id.length > 0) {
            this.getTreeItemByParent(originNodes, item.parent_id, selectedNodes);
        }
        return selectedNodes;
    }

    /*
    * recursive method to get tree items by parent
    * @param originNodes: any[]
    * @param parentId: string
    * @param selectedNodes: any[]
    * @unshift selectedNodes
    */
    private getTreeItemByParent(originNodes, parentId, selectedNodes) {
        for (let item of originNodes) {
            if (item.id == parentId) {
                selectedNodes.unshift(item);
                this.getTreeItemByParent(originNodes, item.parent_id, selectedNodes);
            }
        }
    }
}

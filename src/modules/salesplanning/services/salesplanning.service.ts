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

    public setRetrieveParams(originNodes, item?, nextLevel?) {
        let index = item ? nextLevel ? item.level +1 : item.level : 1;
        this.selectedCharacteristics = this.characteristics.slice(0, index);
        this.selectedNodes = this.getSelectedNodes(item, originNodes);
    }

    private getSelectedNodes(node, originNodes) {
        let selectedNodes = [];
        if (node && node.value) selectedNodes = [(node)];
        if (node && node.parent_id && node.parent_id.length > 0) {
            this.getNodeByParent(originNodes, node.parent_id, selectedNodes);
        }
        return selectedNodes;
    }

    private getNodeByParent(originNodes, parentId, selectedNodes) {
        for (let item of originNodes) {
            if (item.id == parentId) {
                selectedNodes.unshift(item);
                this.getNodeByParent(originNodes, item.parent_id, selectedNodes);
            }
        }
    }
}

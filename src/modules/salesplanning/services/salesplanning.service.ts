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

    get selectedCharacteristicIds() {
        return this.selectedCharacteristics.map(char => char.id);
    }

    public setRetrieveParams(originNodes, item?, nextLevel?) {
        let index = item ? nextLevel ? item.level +1 : item.level : 1;
        this.selectedCharacteristics = this.characteristics.slice(0, index);
        this.selectedNodes = this.getSelectedNodes(item, originNodes);
    }

    private getSelectedNodes(node, originNodes) {
        let selectedNodes = [];
        if (node && node.value) selectedNodes = [(node.value)];
        if (node && node.parent_id && node.parent_id.length > 0) {
            this.getNodeByParent(originNodes, node.parent_id, selectedNodes);
        }
        selectedNodes.unshift('root');
        return selectedNodes;
    }

    private getNodeByParent(originNodes, parentId, selectedNodes) {
        for (let item of originNodes) {
            if (item.id == parentId) {
                selectedNodes.unshift(item.value);
                this.getNodeByParent(originNodes, item.parent_id, selectedNodes);
            }
        }
    }
}

/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

/**
 * @module ModuleSalesPlanning
 */
import {Component, Input, OnChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";

@Component({
    selector: 'sales-planning-tool-content',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontent.html'
})

export class SalesPlanningToolContent implements OnChanges {

    @Input() private node: any;
    private nodeItemName: string = '';
    private isLoading: boolean = false;

    constructor(private language: language, private backend: backend, private planningService: SalesPlanningService) {
    }

    public ngOnChanges() {
        this.getNodeItemName();
    }

    private getNodeItemName() {
        if (!this.node) return;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodeInfo`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.planningNode) {
                    this.nodeItemName = nodeInfo.nodeText;
                    this.getNodeContent(nodeInfo.planningNode);
                }
            });
    }

    private getNodeContent(planningNode) {
        if (!this.node) return;
        let params = {
            planningNode: planningNode,
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/NodeContent`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.nodeText) {
                    this.nodeItemName = nodeInfo.nodeText;
                }
            });
    }
}

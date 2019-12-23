/**
 * @module ModuleReportsDesigner
 */
import {Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";


@Injectable()
export class ReportsDesignerService {
    public dropLists: CdkDropList[] = [];
    public treeCDKDragList: CdkDropList;
    public currentPath: string;
    public dragPlaceHolderNode: Node;
    public moduleFields: any[] = [];
    public operatorCount: any = {};
    public operatorTypes: any = {};
    public operatorAssignments: any = {};
    public expertMode: boolean = false;

    constructor(private configurationService: configurationService, private backend: backend) {
        let reporterConfig = this.configurationService.getData('reporterConfig');
        if (!reporterConfig) {
            this.backend.getRequest('KReporter/core/whereoperators/all').subscribe(reporterConfig => {
                this.configurationService.setData('reporterConfig', reporterConfig);
                this.setConfigs(reporterConfig);
            });
        } else {
            this.setConfigs(reporterConfig);
        }
    }

    private setConfigs(config) {
        this.operatorCount = config.operatorCount;
        this.operatorTypes = config.operatorTypes;
        this.operatorAssignments = config.operatorAssignments;
    }

    public removePlaceHolderElement(containerElement) {
        if (this.dragPlaceHolderNode) {
            containerElement.removeChild(this.dragPlaceHolderNode);
            this.dragPlaceHolderNode = undefined;
        }
    }

}

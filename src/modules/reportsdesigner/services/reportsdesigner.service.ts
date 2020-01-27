/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, EventEmitter, Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";


@Injectable()
export class ReportsDesignerService {
    public dropLists: CdkDropList[] = [];
    public treeCDKDragList: CdkDropList | string;
    public currentPath: any = {};
    public activeModule: any = {};
    public dragPlaceHolderNode: Node;
    public operatorCount: any = {};
    public operatorTypes: any = {};
    public operatorAssignments: any = {};
    public expertMode: boolean = false;
    public expandedItemId: string = '';
    public rootModuleDragListId: string = 'reportsDesignerTreeDragListRoot';

    constructor(private configurationService: configurationService,
                private backend: backend,
                private cdr: ChangeDetectorRef,
                private modelUtils: modelutilities) {
        this.loadReporterConfig();
    }

    /*
    * @param module: string
    * @param value: string
    * @set currentPath
    */
    public setCurrentPath(module, value) {
        return this.currentPath[module] = value;
    }
    /*
    * @return currentPath[module]: string
    */
    public getCurrentPath(module?) {
        return module ? this.currentPath[module] : this.activeModule ? this.currentPath[this.activeModule.module] : undefined;
    }

    /*
    * @configurationService.getData reporterConfig
    * @configurationService.setData reporterConfig if is not defined
    * @setConfigs
    */
    private loadReporterConfig() {
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

    /*
    * @set operatorCount
    * @set operatorTypes
    * @set operatorAssignments
    */
    private setConfigs(config) {
        this.operatorCount = config.operatorCount;
        this.operatorTypes = config.operatorTypes;
        this.operatorAssignments = config.operatorAssignments;
    }

    /*
    * @removeChild dragPlaceHolderNode from containerElement
    * @reset dragPlaceHolderNode
    */
    public removePlaceHolderElement(containerElement) {
        if (this.dragPlaceHolderNode) {
            containerElement.removeChild(this.dragPlaceHolderNode);
            this.dragPlaceHolderNode = undefined;
        }
    }

    /*
    * @return guid: string
    */
    public generateGuid() {
        return 'k' + this.modelUtils.generateGuid().replace(/-/g, '');
    }

}

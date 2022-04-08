/**
 * @module ModuleReportsDesigner
 */
import {ChangeDetectorRef, EventEmitter, Injectable} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";


@Injectable()
export class ReportsDesignerService {
    public treeCDKDragList: CdkDropList | string;
    public currentPath: any = {};
    public activeModule: any = {};
    public dragPlaceHolderNode: Node;
    public operatorCount: any = {};
    public operatorTypes: any = {};
    public operatorAssignments: any = {};

    /**
     * sets the reporter into expert mode. set tor true bx default
     */
    public expertMode: boolean = true;
    public manipulateExpandedItemId: string = '';
    public visualizeActiveLayoutItem: string = '';
    public visualizeColorTheme: any[] = [];

    constructor(public configurationService: configurationService,
                public backend: backend,
                public cdr: ChangeDetectorRef,
                public model: model,
                public language: language,
                public metadata: metadata,
                public modelUtils: modelutilities) {
        this.loadReporterConfig();
    }

    /**
     * @return object[]
     */
    get listFields() {
        return this.model.getField('listfields');
    }

    /**
     * set the model listfields
     * @param value: object[]
     */
    set listFields(value) {
        this.model.setField('listfields', value);
    }

    /**
     * load plugins from component set
     * @input forComponent: string
     * @return plugins: object[]
     */
    public loadPlugins(forComponent) {
        const conf = this.metadata.getComponentConfig(forComponent, 'KReports');
        if (conf.componentset && conf.componentset.length > 0) {
            const items = this.metadata.getComponentSetObjects(conf.componentset);
            if (!items || items.length == 0) return;
            return items
                .filter(item => !!item.componentconfig)
                .map(item => ({
                    name: this.language.getLabel(item.componentconfig.name),
                    id: item.componentconfig.plugin,
                    component: item.componentconfig.component,
                    sequence: item.sequence
                }))
                .sort((a, b) => !isNaN(parseInt(a.sequence, 10)) && !isNaN(parseInt(b.sequence, 10)) ? +a.sequence > +b.sequence ? 1 : -1 : 0);
        }
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
    public loadReporterConfig() {
        let reporterConfig = this.configurationService.getData('reporterConfig');
        if (!reporterConfig) {
            this.backend.getRequest('module/KReports/core/whereoperators/all').subscribe(reporterConfig => {
                this.configurationService.setData('reporterConfig', reporterConfig);
                this.setConfigs(reporterConfig);
            });
        } else {
            this.setConfigs(reporterConfig);
        }
    }

    /**
     * load report color themes from backend
     */
    public loadVisualizationColors() {
        this.backend.getRequest(`module/KReports/core/vizcolors`).subscribe(res => {
            if (!res) return;
            this.visualizeColorTheme = res.map(item => {
                item.colors = item.colors.split('*');
                return item;
            });
        });
    }

    /*
    * @set operatorCount
    * @set operatorTypes
    * @set operatorAssignments
    */
    public setConfigs(config) {
        this.operatorCount = config.operatorCount;
        this.operatorTypes = config.operatorTypes;
        this.operatorAssignments = config.operatorAssignments;
    }

    /*
    * @removeChild dragPlaceHolderNode from containerElement
    * @reset dragPlaceHolderNode
    */
    public removePlaceHolderElement(containerElement) {
        if (this.dragPlaceHolderNode && containerElement.contains(this.dragPlaceHolderNode)) {
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

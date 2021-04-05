/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    constructor(private configurationService: configurationService,
                private backend: backend,
                private cdr: ChangeDetectorRef,
                private model: model,
                private language: language,
                private metadata: metadata,
                private modelUtils: modelutilities) {
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

    /**
     * load report color themes from backend
     */
    public loadVisualizationColors() {
        this.backend.getRequest(`KReporter/core/vizcolors`).subscribe(res => {
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

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
import {Component, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {model} from "../../../services/model.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {navigation} from "../../../services/navigation.service";
import {favorite} from "../../../services/favorite.service";
import {Subscription} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";
import {navigationtab} from "../../../services/navigationtab.service";

declare var _;
const ANIMATIONS: any = [
    trigger('collapseContainerAnimation', [
        state('open', style({width: '25%'})),
        state('closed', style({width: 0})),
        transition('open <=> closed', [
            animate('.5s'),
        ])
    ]),
    trigger('collapseListAnimation', [
        state('open', style({overflow: 'initial', width: '100%', opacity: 1})),
        state('closed', style({overflow: 'hidden', width: 0, opacity: 0})),
        transition('open <=> closed', [
            animate('.5s'),
        ])
    ])
];

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtool.html',
    providers: [SalesPlanningService],
    animations: ANIMATIONS
})

export class SalesPlanningTool {

    public self: any = {};
    public subscriptions: Subscription = new Subscription();
    private isLoading: boolean = false;
    private isCollapsed: boolean = false;
    private isHovered: boolean = false;
    private isAnimating: boolean = false;
    private hoverTimeout: any;
    private mouseEnterListener: () => void;
    @ViewChild('hoverTriggerContainer', {
        read: ViewContainerRef,
        static: true
    }) private hoverTriggerContainer: ViewContainerRef;

    constructor(private language: language,
                private backend: backend,
                private renderer: Renderer2,
                private navigation: navigation,
                private model: model,
                private broadcast: broadcast,
                private favorite: favorite,
                private navigationtab: navigationtab,
                private planningService: SalesPlanningService) {
        this.initialize();
    }

    get selectedNode() {
        return this.planningService.selectedNode;
    }

    get contentContainerClass() {
        return this.isAnimating || this.isCollapsed && !this.isHovered ? 'slds-grow' : 'slds-size--3-of-4';
    }

    get characteristicsLoaded() {
        return this.planningService.characteristics.length > 0;
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @set model from the activated route
    * @get model data
    * @get contentFields
    * @set active module
    * @enable favorite
    * @set versionId
    * @get all characteristics
    * @subscribe model.save
    */
    private initialize() {

        this.subscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                const params = route.params;
                if (!params.id || params.id.length == 0 || !params.module || params.module.length == 0) return;
                this.model.module = params.module;
                this.model.id = params.id;
                this.planningService.versionId = this.model.id;

                this.model.getData().subscribe(item => {

                    this.navigationtab.setTabInfo({displayname: item.name, displaymodule: this.model.module});
                    this.getContentFields(item);
                    this.navigation.setActiveModule(this.model.module, this.model.id, item.summary_text);
                });

                this.getCharacteristicList();
                this.subscribeToModelSave();
            })
        );
    }

    /*
    * @subscribe model.save
    * @get characteristics
    * @reset selection
    */
    private subscribeToModelSave() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(msg => {
                let res = msg.messagedata;
                if (res.module == this.model.module && res.id == this.model.id && msg.messagetype == 'model.save') {
                    this.getCharacteristicList();
                    this.resetSelections();
                }
            })
        );
    }

    /*
    * @reset selectedCharacteristics
    * @reset selectedNodes
    * @reset selectedNode
    */
    private resetSelections() {
        this.planningService.selectedCharacteristics = [];
        this.planningService.selectedNodes = [];
        this.planningService.selectedNode = undefined;
    }

    /*
    * @get characteristics
    * @sort characteristics by sequence
    * @set characteristicTerritory label
    */
    private getCharacteristicList() {
        this.planningService.characteristics = [];
        this.isLoading = true;
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/CharacteristicList`)
            .subscribe(char => {
                if (char && char.data) {
                    this.planningService.characteristics = char.data;
                    this.planningService.characteristics
                        .sort((a, b) => a.id == this.planningService.characteristicTerritory || a.sequence < b.sequence ? -1 : 1);
                    this.planningService.characteristics
                        .some(char => {
                            if (char.id == this.planningService.characteristicTerritory) {
                                char.value = this.language.getLabel('LBL_TERRITORY');
                                return true;
                            }
                        });
                    this.isLoading = false;
                }
            });
    }

    /*
    * @param parent: any
    * @sort contentFields by (sort_order | summary_text)
    * @set contentFields
    */
    private getContentFields(parent) {
        if (!parent || !parent.salesplanningcontents) return;
        let content = _.toArray(parent.salesplanningcontents.beans).length > 0 ? _.toArray(parent.salesplanningcontents.beans)[0] : undefined;
        if (!content || !content.salesplanningcontentfields) return;
        let array = _.toArray(content.salesplanningcontentfields.beans);
        array.sort((a, b) => a.sort_order && b.sort_order ? a.sort_order > b.sort_order ? 1 : -1 : a.summary_text > b.summary_text ? 1 : -1);
        this.planningService.contentFields = array;
    }

    /*
    * @toggle? isCollapsed
    * @clear? hoverTimeout
    */
    private toggleCollapseView() {
        if (!this.isHovered) {
            this.isCollapsed = !this.isCollapsed;
        } else {
            window.clearTimeout(this.hoverTimeout);
        }
    }

    /*
    * @set isAnimating
    * @removeListener mouseEnterListener
    */
    private onAnimationStart() {
        this.isAnimating = true;
        if (this.mouseEnterListener) this.mouseEnterListener();
    }

    /*
    * @set isAnimating
    * @listen mouseEnter on tree open trigger
    */
    private onAnimationDone() {
        this.isAnimating = false;
        if (this.isCollapsed) {
            this.mouseEnterListener = this.renderer
                .listen(this.hoverTriggerContainer.element.nativeElement, 'mouseenter', () => {
                    this.toggleHover(true);
                });
        }
    }

    /*
    * @clear hoverTimeout
    * @setTimeout hoverTimeout if isHovered true
    * @set isHovered
    */
    private toggleHover(bool) {
        if (!this.isCollapsed) return;
        window.clearTimeout(this.hoverTimeout);
        if (bool) {
            this.hoverTimeout = window.setTimeout(() => this.isHovered = true, 500);
        } else {
            this.isHovered = false;
        }
    }
}

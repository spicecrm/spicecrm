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

export class SalesPlanningTool implements OnInit {

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
                private planningService: SalesPlanningService) {
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

    public ngOnInit() {
        this.initialize();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    /**
     * @model.initialize
     * @set model.id
     * @model.getData
     * @openSelectModuleModal
     * @set currentPath
     * @set activeModule
     */
    private subscribeToActivatedRoute() {
        this.subscriptions.add(
            this.navigationtab.activeRoute$.subscribe(route => {
                const params = route.params;
                if (!params.id || params.id.length == 0) return;
                if (params.id == 'new') {
                    this.openSelectModuleModal();
                } else {
                    this.model.id = params.id;
                    this.model.getData()
                        .subscribe(res => {
                            if (!res.report_module || res.report_module.length == 0) {
                                this.openSelectModuleModal();
                                this.activeTab = 'details';
                            } else {
                                const module = this.model.getField('report_module');
                                this.reportsDesignerService.setCurrentPath(module, module);
                                this.reportsDesignerService.activeModule = {unionid: 'root', module: res.report_module};
                            }
                            if (!res.listfields) this.model.setField('listfields', []);
                            if (!res.whereconditions) this.model.setField('whereconditions', []);

                            // set the tab info
                            this.navigationtab.setTabInfo({displayname: this.model.getField('name'), displaymodule: this.model.module});
                        });
                }
            })
        );
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
        this.activatedRoute.params.subscribe(params => {
            this.model.module = params.module;
            this.model.id = params.id;
        });
        this.model.getData().subscribe(item => {
            this.getContentFields(item);
            this.navigation.setActiveModule(this.model.module, this.model.id, item.summary_text);
        });

        this.planningService.versionId = this.model.id;
        this.getCharacteristicList();
        this.subscribeToModelSave();
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

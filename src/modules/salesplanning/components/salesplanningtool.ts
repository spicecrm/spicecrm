/**
 * @module ModuleSalesPlanning
 */
import {Component, OnInit, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {ActivatedRoute} from "@angular/router";
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
    private hoverTimeout: any;
    private mouseEnterListener: () => void;
    @ViewChild('hoverTriggerContainer', {
        read: ViewContainerRef,
        static: true
    }) private hoverTriggerContainer: ViewContainerRef;

    constructor(private language: language,
                private backend: backend,
                private activatedRoute: ActivatedRoute,
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
        return this.isCollapsed && !this.isHovered ? 'slds-grow' : 'slds-size--3-of-4';
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

    private initialize() {
        this.activatedRoute.params.subscribe(params => {
            this.model.module = params.module;
            this.model.id = params.id;
        });
        this.model.getData().subscribe(item => {
            this.setContentFields(item);
            this.navigation.setActiveModule(this.model.module, this.model.id, item.summary_text);
        });
        this.favorite.enable(this.model.module, this.model.id);
        this.planningService.versionId = this.model.id;
        this.getCharacteristicList();
        this.subscribeToChanges();
    }

    private subscribeToChanges() {
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

    private resetSelections() {
        this.planningService.selectedCharacteristics = [];
        this.planningService.selectedNodes = [];
        this.planningService.selectedNode = undefined;
    }

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

    private setContentFields(parent) {
        if (!parent || !parent.salesplanningcontents) return;
        let content = _.toArray(parent.salesplanningcontents.beans).length > 0 ? _.toArray(parent.salesplanningcontents.beans)[0] : undefined;
        if (!content || !content.salesplanningcontentfields) return;
        let array = _.toArray(content.salesplanningcontentfields.beans);
        array.sort((a, b) => a.sort_order && b.sort_order ? a.sort_order > b.sort_order ? 1 : -1 : a.summary_text > b.summary_text ? 1 : -1);
        this.planningService.contentFields = array;
    }

    private toggleCollapseView() {
        if (!this.isHovered) {
            this.isCollapsed = !this.isCollapsed;
        } else {
            window.clearTimeout(this.hoverTimeout);
        }
    }

    private onAnimationStart() {
        if (this.mouseEnterListener) this.mouseEnterListener();
    }

    private onAnimationDone() {
        if (this.isCollapsed) {
            this.mouseEnterListener = this.renderer
                .listen(this.hoverTriggerContainer.element.nativeElement, 'mouseenter', () => {
                    this.toggleHover(true);
                });
        }
    }

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

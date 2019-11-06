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

declare var _;

@Component({
    templateUrl: './src/modules/salesplanning/templates/salesplanningtool.html',
    providers: [SalesPlanningService, model],
    animations: [
    trigger('collapseContainerAnimation', [
        state('open', style({ width: '25%'})),
        state('closed', style({ width: 0})),
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
    ]),
]})

export class SalesPlanningTool implements OnInit {

    private isLoading: boolean = false;
    private isCollapsed: boolean = false;
    private isHovered: boolean = false;
    private hoverTimeout: any;
    private mouseEnterListener: ()=> void;

    @ViewChild('hoverTriggerContainer', {read: ViewContainerRef ,static: true}) private hoverTriggerContainer: ViewContainerRef;

    constructor(private language: language,
                private backend: backend,
                private activatedRoute: ActivatedRoute,
                private renderer: Renderer2,
                private model: model,
                private planningService: SalesPlanningService) {
        model.module = 'SalesPlanningVersions';
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
        this.activatedRoute.params.subscribe(params => {
            this.planningService.versionId = params.versionId;
            this.model.id = params.versionId;
            this.model.getData()
                .subscribe(item => this.setContentFields(item));
            this.getCharacteristicList();
        });
    }

    private getCharacteristicList() {
        this.planningService.characteristics = [];
        this.isLoading = true;
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/CharacteristicList`)
            .subscribe(char => {
                if (char && char.data) {
                    this.planningService.characteristics = char.data;
                    this.planningService.characteristics.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
                    this.planningService.characteristics.some(char => {
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
        if (bool) this.hoverTimeout = window.setTimeout(()=> this.isHovered = true, 500);
        else this.isHovered = false;
    }
}

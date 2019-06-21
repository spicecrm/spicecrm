/**
 * @module ModuleDashboard
 */
import {AfterViewInit, Component, OnDestroy, Renderer2, ViewChild, ViewContainerRef,} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-body',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerbody.html',
    styles: [
            `.slds-button--icon {
            color: #eeeeee
        }

        .slds-button--icon:hover {
            color: #5B5B5B
        }`
    ]
})
export class DashboardContainerBody implements OnDestroy {
    @ViewChild('bodycontainer', {read: ViewContainerRef, static: false}) private bodycontainer: ViewContainerRef;
    private resizeListener: any;

    constructor(private dashboardlayout: dashboardlayout, private language: language, private renderer: Renderer2) {
        this.resizeListener = this.renderer.listen('window', 'resize',()=> this.calculateGrid());
    }

    get dashboardGrid() {
        return this.dashboardlayout.dashboardGrid;
    }

    get dashboardElements() {
        return this.dashboardlayout.dashboardElements;
    }

    get isEditMode() {
        return this.dashboardlayout.editMode;
    }

    get bodyContainerStyle() {
        return {
            'border': this.dashboardlayout.editMode ? '1px dashed #ca1b21' : '0',
            'width': '100%'
        };
    }

    public ngAfterViewInit() {
        this.dashboardlayout.bodyContainerRef = this.bodycontainer;
    }

    private trackByGridFn(index, item) {
        return index;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    private calculateGrid() {
        if (window.innerWidth < 1024) {
            this.dashboardlayout.editMode = false;
        }
        if (!this.isEditMode) {
            return;
        }
        this.dashboardlayout.calculateGrid();
    }

    private addDashlet(column) {
        this.dashboardlayout.addDashlet(column);
    }

    ngOnDestroy() {
        if (this.resizeListener) {
            this.resizeListener();
        }
    }
}

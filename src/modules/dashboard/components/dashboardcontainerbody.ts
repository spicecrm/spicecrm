/**
 * @module ModuleDashboard
 */
import {Component, OnDestroy, Renderer2, ViewChild, ViewContainerRef,} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";


@Component({
    selector: 'dashboard-container-body',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerbody.html'
})
export class DashboardContainerBody implements OnDestroy {
    @ViewChild('bodycontainer', {read: ViewContainerRef, static: true}) private bodycontainer: ViewContainerRef;
    private resizeListener: any;

    constructor(private dashboardlayout: dashboardlayout,
                private language: language,
                private renderer: Renderer2,
                private view: view,
                private model: model) {
        this.resizeListener = this.renderer.listen('window', 'resize', () => this.calculateGrid());
    }

    get isLoading() {
        return this.model.isLoading;
    }

    get dashboardGrid() {
        return this.dashboardlayout.dashboardGrid;
    }

    get dashboardElements() {
        return this.dashboardlayout.dashboardElements;
    }

    get isEditMode() {
        return this.view.isEditMode();
    }

    get bodyContainerStyle() {
        return {
            border: this.view.isEditMode() ? '1px dashed #ca1b21' : '0',
            width: '100%'
        };
    }

    public ngAfterViewInit() {
        this.dashboardlayout.bodyContainerRef = this.bodycontainer;
    }

    public ngOnDestroy() {
        if (this.resizeListener) {
            this.resizeListener();
        }
    }

    /*
    * to prevent dom unnecessary rerendering on changes
    * @param index
    * @param item
    * @return index | item
    */
    private trackByGridFn(index, item) {
        return index;
    }

    /*
    * to prevent dom unnecessary rerendering on changes
    * @param index
    * @param item
    * @return index | item
    */
    private trackByItemFn(index, item) {
        return item.id;
    }

    /*
    * prevent editing in mobile view
    * @return void
    */
    private calculateGrid() {
        if (window.innerWidth < 1024) {
            this.view.setViewMode();
            this.model.cancelEdit();
        }
        if (this.isEditMode) this.dashboardlayout.calculateGrid();
    }

    /*
    * @param column
    * @return void
    */
    private addDashlet(column) {
        this.dashboardlayout.addDashlet(column);
    }
}

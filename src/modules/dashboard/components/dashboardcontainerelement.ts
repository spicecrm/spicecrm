/**
 * @module ModuleDashboard
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {dashboardlayout} from "../services/dashboardlayout.service";
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";

@Component({
    selector: "dashboard-container-element",
    templateUrl: "../templates/dashboardcontainerelement.html"
})
export class DashboardContainerElement implements AfterViewInit {
    @ViewChild("containerelement", {read: ViewContainerRef, static: false}) public containerelement: ViewContainerRef;

    public componentRefs: any[] = [];
    public isAuthorized: boolean = true;
    @Input() public item: any = {};
    public mouseMoveListener: any = undefined;
    public mouseUpListener: any = undefined;
    public mouseLast: any = null;
    public mouseStart: any = null;
    public mouseTarget: string = "";
    public isMoving: boolean = false;

    constructor(public dashboardlayout: dashboardlayout,
                public metadata: metadata,
                public renderer: Renderer2,
                public model: model,
                public view: view) {
    }

    get containerClass() {
        return {
            'slds-scrollable--y': !this.view.isEditMode(),
            'slds-is-absolute': !this.dashboardlayout.compactView,
            'slds-m-vertical_xx-small': this.dashboardlayout.compactView
        };
    }

    public ngAfterViewInit() {
        this.renderDashlet();
    }

    public renderDashlet() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
        // assign the isAuthorized on setTimeout callback function to avoid angular change detection error "ExpressionChangedAfterItHasBeenCheckedError"
        window.setTimeout(() => this.isAuthorized = this.item.module ? this.metadata.checkModuleAcl(this.item.module, this.item.acl_action ? this.item.acl_action : "list") : true);
        if (this.item.component && this.isAuthorized) {
            this.metadata.addComponent(this.item.component, this.containerelement)
                .subscribe(componentRef => {
                    componentRef.instance.dashletconfig = this.item.dashletconfig;
                    componentRef.instance.acl_action = this.item.acl_action;
                    componentRef.instance.icon = this.item.icon;
                    componentRef.instance.dashlet_id = this.item.dashlet_id;
                    componentRef.instance.componentconfig = this.item.componentconfig;
                    componentRef.instance.dashletModule = this.item.module;
                    componentRef.instance.dashletLabel = this.item.label;
                    this.componentRefs.push(componentRef);
                });
        }
    }

    public isEditing() {
        return this.view.isEditMode() && this.item.id === this.dashboardlayout.editing;
    }

    public getBoxStyle() {
        let itemPos = this.item.position;
        let elementStyle = this.dashboardlayout.getElementStyle(itemPos.top, itemPos.left, itemPos.width, itemPos.height);
        let style = this.dashboardlayout.applyMove(elementStyle, this.mouseTarget, this.mouseStart, this.mouseLast);

        if (this.isEditing()) {
            style.border = "1px dashed #ca1b21";
            style.cursor = "move";
            if (this.isMoving) {
                style.opacity = ".5";
                style["z-index"] = "9999";
            }
        }
        return this.dashboardlayout.prepareStyle(style);
    }

    public getBoundingBoxStyle(position): any {
        let itemPos = this.item.position;
        let elementStyle = this.dashboardlayout.getElementStyle(itemPos.top, itemPos.left, itemPos.width, itemPos.height);
        let rect = this.dashboardlayout.applyMove(elementStyle, this.mouseTarget, this.mouseStart, this.mouseLast);
        let style: any = {};

        switch (position) {
            case "top":
                style = {top: -4, left: rect.width / 2 - 4, cursor: "n-resize"};
                break;
            case "bottom":
                style = {top: rect.height - 5, left: rect.width / 2 - 4, cursor: "s-resize"};
                break;
            case "left":
                style = {top: rect.height / 2 - 4, left: '-4px', cursor: "w-resize"};
                break;
            case "right":
                style = {left: rect.width - 5, top: rect.height / 2 - 4, cursor: "e-resize"};
                break;
        }

        style["background-color"] = "#fff";
        style.position = "absolute";
        style.border = "1px solid #ca1b21";
        style.width = "8px";
        style.height = "8px";

        return this.dashboardlayout.prepareStyle(style);
    }

    public onMousedown(target, e) {
        if (this.view.isEditMode()) {
            this.mouseTarget = target;

            this.dashboardlayout.editing = this.item.id;
            this.mouseStart = e;
            this.mouseLast = e;

            this.mouseUpListener = this.renderer.listen("document", "mouseup", (event) => this.onMouseUp());
            this.mouseMoveListener = this.renderer.listen("document", "mousemove", (event) => this.onMouseMove(event));

            this.isMoving = true;

            // prevent select event trigger
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.cancelBubble = true;
            e.returnValue = false;
        }
    }

    public onMouseMove(e) {
        if (this.view.isEditMode()) {
            this.mouseLast = e;
        }
        this.handleScrolling();
    }

    public onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        this.dropItem();

        this.mouseStart = null;
        this.mouseLast = null;
        this.mouseTarget = "";

        this.isMoving = false;
    }

    public handleScrolling() {
        if (!this.view.isEditMode() || !this.isMoving) {
            return;
        }

        let moveY = this.mouseLast.pageY - this.mouseStart.pageY;
        let item = this.item.position;
        item = this.dashboardlayout.getElementStyle(item.top, item.left, item.width, item.height);
        let itemHeight = this.mouseTarget == 'bottom' ? (item.height + moveY) : item.height;
        let itemBottom = this.mouseTarget == 'content' ? ((item.top + moveY) + itemHeight) : (item.top + itemHeight);
        let container = this.dashboardlayout.bodyContainerRef;
        let containerBottom = container.getBoundingClientRect().bottom - container.offsetTop;
        if (itemBottom > (containerBottom - 50)) {
            container.scrollTop += 5;
        }
    }

    public dropItem() {
        if (!this.mouseLast || !this.mouseStart) {
            return false;
        }
        let movey = this.mouseLast.pageY - this.mouseStart.pageY;
        let movex = this.mouseLast.pageX - this.mouseStart.pageX;
        this.dashboardlayout.dropElement(this.item.id, movex, movey, this.mouseTarget, this.mouseLast);
    }
}

import {AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {dashboardlayout} from "../services/dashboardlayout.service";

@Component({
    selector: "dashboard-container-element",
    templateUrl: "./src/modules/dashboard/templates/dashboardcontainerelement.html"
})
export class DashboardContainerElement implements AfterViewInit {
    @ViewChild("containerelement", {read: ViewContainerRef}) private containerelement: ViewContainerRef;

    private componentRefs: Array<any> = [];
    private isAuthorized: boolean = true;
    @Input() private item: any = {};
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseLast: any = null;
    private mouseStart: any = null;
    private mouseTarget: string = "";

    constructor(private dashboardlayout: dashboardlayout,
                private metadata: metadata,
                private renderer: Renderer2,
                private language: language,
                private elementRef: ElementRef) {
    }

    get compactView() {
        return this.dashboardlayout.compactView;
    }

    public ngAfterViewInit() {
        this.renderDashlet();
    }

    private renderDashlet() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.isAuthorized = this.item.module ? this.metadata.checkModuleAcl(this.item.module, this.item.acl_action ? this.item.acl_action : "list") : true;
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

    private isEditing() {
        return this.dashboardlayout.editMode && this.item.id === this.dashboardlayout.editing;
    }

    private getBoxStyle() {
        let style = this.dashboardlayout.getElementStyle(this.item.position.top, this.item.position.left, this.item.position.width, this.item.position.height);
        style = this.applyMove(style);

        if (this.isEditing()) {
            style.border = "1px dashed #ca1b21";
            style.cursor = "move";
            if (this.dashboardlayout.isMoving) {
                style.opacity = ".5";
                style["z-index"] = "9999";
            }
        }
        return this.dashboardlayout.prepareStyle(style);
    }

    private getBoundingBoxStyle(position): any {
        let rect = this.dashboardlayout.getElementStyle(this.item.position.top, this.item.position.left, this.item.position.width, this.item.position.height);
        rect = this.applyMove(rect);
        let style: any = {};

        switch (position) {
            case "top":
                style = {
                    top: -4,
                    left: rect.width / 2 - 4,
                    cursor: "n-resize"
                };
                break;
            case "bottom":
                style = {
                    top: rect.height - 5,
                    left: rect.width / 2 - 4,
                    cursor: "s-resize"
                };
                break;
            case "left":
                style = {
                    top: rect.height / 2 - 4,
                    left: '-4px',
                    cursor: "w-resize"
                };
                break;
            case "right":
                style = {
                    left: rect.width - 5,
                    top: rect.height / 2 - 4,
                    cursor: "e-resize"
                };
                break;
        }

        style["background-color"] = "#fff";
        style.position = "absolute";
        style.border = "1px solid #ca1b21";
        style.width = "8px";
        style.height = "8px";

        return this.dashboardlayout.prepareStyle(style);
    }

    private applyMove(rect) {
        let style = rect;
        let mainContainer: any = this.dashboardlayout.mainContainer;
        let mainContainerRight: number = mainContainer.right - mainContainer.x;
        let margin: number = this.dashboardlayout.boxMargin;
        let boxWidth: number = this.dashboardlayout.elementWidth - (2 * margin);
        let boxHeight: number = this.dashboardlayout.elementHeight - (2 * margin);
        let movex: number;
        let movey: number;

        if (this.mouseLast && this.mouseStart) {
            movex = this.mouseLast.pageX - this.mouseStart.pageX;
            movey = this.mouseLast.pageY - this.mouseStart.pageY;
        }

        if (this.mouseStart) {
            switch (this.mouseTarget) {
                case "content":
                    style.left = style.left + movex;
                    style.top = style.top + movey;
                    if (style.left < margin) {
                        style.left = margin;
                    }
                    if (style.top < margin) {
                        style.top = margin;
                    }
                    if ((style.left + style.width) > mainContainerRight) {
                        style.left = mainContainerRight - style.width - margin;
                    }
                    break;
                case "right":
                    style.width = style.width + movex;
                    if ((style.left + style.width) > mainContainerRight) {
                        style.width = mainContainerRight - style.left - margin;
                        style.left = mainContainerRight - style.width - margin;
                    }
                    if (style.width < boxWidth) {
                        style.width = boxWidth;
                    }
                    break;
                case "left":
                    let elRight = style.width + style.left;
                    style.width = style.width - movex;
                    style.left = style.left + movex;
                    if (style.left < margin) {
                        style.left = margin;
                        style.width = elRight - margin;
                    }
                    if (style.width < boxWidth) {
                        style.width = boxWidth;
                        style.left = elRight - style.width;
                    }
                    break;
                case "bottom":
                    style.height = style.height + movey;
                    if (style.height < boxHeight) {
                        style.height = boxHeight;
                    }
                    break;
                case "top":
                    let elBottom = style.height + style.top;
                    style.height = style.height - movey;
                    style.top = style.top + movey;
                    if (style.top < margin) {
                        style.top = margin;
                        style.height = elBottom - margin;
                    }
                    if (style.height < boxHeight) {
                        style.height = boxHeight;
                        style.top = elBottom - style.height;
                    }
                    break;
            }
        }

        return style;
    }

    private onMousedown(target, e) {
        if (this.dashboardlayout.editMode) {
            this.mouseTarget = target;

            this.dashboardlayout.editing = this.item.id;
            this.mouseStart = e;
            this.mouseLast = e;

            this.mouseUpListener = this.renderer.listen("document", "mouseup", (event) => this.onMouseUp());
            this.mouseMoveListener = this.renderer.listen("document", "mousemove", (event) => this.onMouseMove(event));

            this.dashboardlayout.isMoving = true;

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

    private onMouseMove(e) {
        if (this.dashboardlayout.editMode) {
            this.mouseLast = e;
        }
    }

    private onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        this.dropItem();

        this.mouseStart = null;
        this.mouseLast = null;
        this.mouseTarget = "";

        this.dashboardlayout.isMoving = false;
    }

    private dropItem() {
        if (!this.mouseLast || !this.mouseStart) {
            return false;
        }
        let movey = this.mouseLast.pageY - this.mouseStart.pageY;
        let movex = this.mouseLast.pageX - this.mouseStart.pageX;
        this.dashboardlayout.dropElement(this.item.id, movex, movey, this.mouseTarget, this.mouseLast);
    }
}

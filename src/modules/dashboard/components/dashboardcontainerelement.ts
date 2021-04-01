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
 * @module ModuleDashboard
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {dashboardlayout} from "../services/dashboardlayout.service";
import {view} from "../../../services/view.service";
import {model} from "../../../services/model.service";

@Component({
    selector: "dashboard-container-element",
    templateUrl: "./src/modules/dashboard/templates/dashboardcontainerelement.html"
})
export class DashboardContainerElement implements AfterViewInit {
    @ViewChild("containerelement", {read: ViewContainerRef, static: false}) private containerelement: ViewContainerRef;

    private componentRefs: any[] = [];
    private isAuthorized: boolean = true;
    @Input() private item: any = {};
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseLast: any = null;
    private mouseStart: any = null;
    private mouseTarget: string = "";
    private isMoving: boolean = false;

    constructor(private dashboardlayout: dashboardlayout,
                private metadata: metadata,
                private renderer: Renderer2,
                private model: model,
                private view: view) {
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

    private renderDashlet() {
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

    private isEditing() {
        return this.view.isEditMode() && this.item.id === this.dashboardlayout.editing;
    }

    private getBoxStyle() {
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

    private getBoundingBoxStyle(position): any {
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

    private onMousedown(target, e) {
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

    private onMouseMove(e) {
        if (this.view.isEditMode()) {
            this.mouseLast = e;
        }
        this.handleScrolling();
    }

    private onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        this.dropItem();

        this.mouseStart = null;
        this.mouseLast = null;
        this.mouseTarget = "";

        this.isMoving = false;
    }

    private handleScrolling() {
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

    private dropItem() {
        if (!this.mouseLast || !this.mouseStart) {
            return false;
        }
        let movey = this.mouseLast.pageY - this.mouseStart.pageY;
        let movex = this.mouseLast.pageX - this.mouseStart.pageX;
        this.dashboardlayout.dropElement(this.item.id, movex, movey, this.mouseTarget, this.mouseLast);
    }
}

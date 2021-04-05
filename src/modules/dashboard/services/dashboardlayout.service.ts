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
 * @module ModuleDashboard
 */
import {Injectable, ViewContainerRef} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';

declare var _;

@Injectable()
export class dashboardlayout {
    public dashboardData: any = {};
    public dashboardGrid: any[] = [];
    public dashboardId: string = '';
    public dashboardElements: any[] = [];
    public boxMargin: number = 5;
    public columns: number = 9;
    public editmode: boolean = false;
    public editing: string = '';
    public isMoving: boolean = false;
    public isloading: boolean = false;
    public dashboardNotFound: boolean = false;
    public bodycontainerref: ViewContainerRef;

    constructor(private backend: backend, public model: model, private modal: modal) {
    }

    get bodyContainerRef() {
        return this.bodycontainerref.element.nativeElement;
    }

    set bodyContainerRef(value) {
        this.bodycontainerref = value;
    }

    get editMode() {
        return this.editmode;
    }

    set editMode(bool) {
        this.editmode = bool;
        if (this.editmode) {
            setTimeout(() => this.calculateGrid(), 100);
        }
    }

    get elementHeight() {
        return this.bodyContainerRef ? this.bodyContainerRef.clientHeight / this.columns : 100;
    }

    get elementWidth() {
        return this.bodyContainerRef ? this.bodyContainerRef.clientWidth / this.columns : 100;
    }

    get compactView() {
        return this.bodyContainerRef.clientWidth < 768;
    }

    public calculateGrid() {
        if (!this.bodyContainerRef) {
            return;
        }

        this.dashboardGrid = [];
        let rowIndex = 0;
        let takenIndices = this.columns;

        for (let element of this.dashboardElements) {
            let elBottom = element.position.top + element.position.height;
            if (this.bodyContainerRef.clientHeight && elBottom > this.columns) {
                takenIndices = elBottom > takenIndices ? elBottom : takenIndices;
            }
        }
        while (rowIndex < takenIndices) {
            let colIndex = 0;
            let dashBoardRow = [];
            while (colIndex < this.columns) {
                dashBoardRow.push({
                    width: (this.bodyContainerRef.clientWidth / this.columns) - (2 * this.boxMargin),
                    height: this.elementHeight - (2 * this.boxMargin),
                    top: ((rowIndex * this.elementHeight) + this.boxMargin),
                    left: (colIndex * this.bodyContainerRef.clientWidth / this.columns) + this.boxMargin
                });
                colIndex++;
            }
            this.dashboardGrid.push(dashBoardRow);
            rowIndex++;
        }
        this.dashboardGrid = this.dashboardGrid.slice();
    }

    /*
     * translate for style from index to pixels on the dashboard
     */
    public getElementStyle(top, left, width, height) {
        let style: any = {};

        style.top = top * this.elementHeight + this.boxMargin;
        style.left = left * this.elementWidth + this.boxMargin;
        style.width = this.compactView ? '100%' : (width * this.elementWidth - 2 * this.boxMargin);
        style.height = height * this.elementHeight - 2 * this.boxMargin;
        return style;
    }

    public dropElement(id, movex, movey, mouseTarget, mouseLast) {
        // item.position count per column
        this.dashboardElements.some(item => {
            if (item.id === id) {
                let moveXDiff = Math.round(movex / this.elementWidth);
                let moveYDiff = Math.round(movey / this.elementHeight);

                const canDrop = this.canDrop(id, item, movex, movey, mouseLast, mouseTarget);
                switch (mouseTarget) {
                    case 'content':
                        if (canDrop.left) {
                            item.position.left += moveXDiff;
                        }

                        if (canDrop.top) {
                            item.position.top += moveYDiff;
                        }
                        break;
                    case 'left':
                        if (canDrop.left) {
                            item.position.width -= moveXDiff;
                            item.position.left += moveXDiff;
                        }
                        break;
                    case 'right':
                        if (canDrop.left) {
                            item.position.width += moveXDiff;
                        }
                        break;
                    case 'top':
                        if (canDrop.top) {
                            item.position.height -= moveYDiff;
                            item.position.top += moveYDiff;
                        }
                        break;
                    case 'bottom':
                        if (canDrop.top) {
                            item.position.height += moveYDiff;
                        }
                        break;
                }
                window.dispatchEvent(new Event('resize'));
                return true;
            }
        });
        setTimeout(() => this.calculateGrid(), 100);
    }

    public canDrop(id, item, movex, movey, mouseLast, mouseTarget) {

        let left: boolean = true;
        let top: boolean = true;
        let moveXDiff = Math.round(movex / this.elementWidth);
        let moveYDiff = Math.round(movey / this.elementHeight);
        let currentElOldLeft: number = item.position.left;
        let currentElOldRight: number = item.position.left + (item.position.width - 1);
        let currentElOldTop: number = item.position.top;
        let currentElOldBottom: number = item.position.top + (item.position.height - 1);
        let currentElLeft: number = currentElOldLeft;
        let currentElWidth: number = item.position.width;
        let currentElRight = currentElOldRight;
        let currentElTop: number = currentElOldTop;
        let currentElHeight: number = item.position.height;
        let currentElBottom = currentElOldBottom;

        switch (mouseTarget) {
            case 'content':
                currentElBottom = currentElOldBottom + moveYDiff;
                currentElRight = currentElOldRight + moveXDiff;
                currentElLeft = currentElOldLeft + moveXDiff;
                currentElTop = currentElOldTop + moveYDiff;
                break;
            case 'left':
                currentElWidth = currentElWidth + moveXDiff;
                currentElLeft = currentElOldLeft + moveXDiff;
                break;
            case 'right':
                currentElWidth = currentElWidth + moveXDiff;
                currentElRight = currentElOldRight + moveXDiff;
                break;
            case 'top':
                currentElHeight = currentElHeight + moveYDiff;
                currentElTop = currentElOldTop + moveYDiff;
                break;
            case 'bottom':
                currentElHeight = currentElHeight + moveYDiff;
                currentElBottom = currentElOldBottom + moveYDiff;
                break;
        }


        for (let element of this.dashboardElements) {

            let elLeft: number = element.position.left;
            let elRight: number = element.position.left + (element.position.width - 1);
            let elTop: number = element.position.top;
            let elBottom: number = element.position.top + (element.position.height - 1);
            let leftIn: boolean = (currentElLeft >= elLeft && currentElLeft <= elRight);
            let rightIn: boolean = (currentElRight <= elRight && currentElRight >= elLeft);
            let topIn: boolean = (currentElTop >= elTop && currentElTop <= elBottom);
            let bottomIn: boolean = (currentElBottom <= elBottom && currentElBottom >= elTop);
            let xIn: boolean = ((rightIn || leftIn) && (topIn || bottomIn) && element.id != id);
            let yIn: boolean = ((topIn || bottomIn) && (leftIn || rightIn) && element.id != id);
            let overflowedX: boolean = (currentElLeft < 0 || currentElRight > (this.columns - 1));
            let overflowedTop: boolean = (currentElTop < 0);
            let isCoveredY: boolean = ((currentElTop < elTop && currentElBottom > elBottom) && (currentElLeft <= elRight && currentElRight >= elLeft) && element.id != id);
            let isCoveredX: boolean = ((currentElRight > elRight && currentElLeft < elLeft) && (currentElTop <= elBottom && currentElBottom >= elTop) && element.id != id);

            switch (mouseTarget) {
                case 'content':
                    if (xIn || yIn || isCoveredX || isCoveredY || overflowedX || overflowedTop) {
                        left = false;
                        top = false;
                    }
                    break;
                case 'left':
                    if (xIn || isCoveredX || overflowedX || (currentElLeft > currentElRight)) {
                        left = false;
                    }
                    break;
                case 'right':
                    if (xIn || isCoveredX || overflowedX || (currentElRight < currentElLeft)) {
                        left = false;
                    }
                    break;
                case 'top':
                    if (yIn || isCoveredY || overflowedTop || (currentElTop > currentElBottom)) {
                        top = false;
                    }
                    break;
                case 'bottom':
                    if (yIn || isCoveredY || overflowedTop || (currentElBottom < currentElTop)) {
                        top = false;
                    }
                    break;
            }
        }

        return {top, left};
    }

    public applyMove(rect, mouseTarget, mouseStart, mouseLast) {
        let style = rect;
        let mainContainer: any = this.bodyContainerRef;
        let mainContainerRight: number = mainContainer.right - mainContainer.x;
        let margin: number = this.boxMargin;
        let boxWidth: number = this.elementWidth - (2 * margin);
        let boxHeight: number = this.elementHeight - (2 * margin);
        let movex: number = 0;
        let movey: number = 0;

        if (mouseLast && mouseStart) {
            movex = mouseLast.pageX - mouseStart.pageX;
            movey = mouseLast.pageY - mouseStart.pageY;
        }

        if (mouseStart) {
            switch (mouseTarget) {
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


    public addDashlet(position) {

        this.modal.openModal('DashboardAddElement')
            .subscribe(modalRef => {
                modalRef.instance.addDashlet
                    .subscribe(dashlet => {
                        if (dashlet !== false) {
                            this.editing = this.model.generateGuid();
                            let element = {
                                id: this.editing,
                                name: dashlet.name,
                                component: dashlet.component,
                                componentconfig: dashlet.componentconfig,
                                dashletconfig: dashlet.dashletconfig,
                                dashlet_id: dashlet.dashlet_id,
                                module: dashlet.module,
                                icon: dashlet.icon,
                                acl_action: dashlet.acl_action,
                                label: dashlet.label,
                                sysuidashboard_id: this.dashboardId,
                                position: {
                                    top: Math.round(position.top / this.elementHeight),
                                    left: Math.round(position.left / this.elementWidth),
                                    width: Math.round(position.width / this.elementWidth),
                                    height: Math.round(position.height / this.elementHeight)
                                },
                                is_new: true,
                            };
                            this.dashboardElements = [...this.dashboardElements, element];
                        }
                    });
            });
    }

    public deleteDashlet(id) {
        this.dashboardElements.some((dashlet, index) => {
            if (dashlet.id === id) {
                this.dashboardElements.splice(index, 1);
                return true;
            }
        });
    }

    public prepareStyle(style) {
        let returnStyle = _.clone(style);
        for (let prop in returnStyle) {
            if (returnStyle.hasOwnProperty(prop) && typeof returnStyle[prop] == 'number') {
                returnStyle[prop] = Math.round(returnStyle[prop]) + 'px';
            }
        }
        return returnStyle;
    }

    public sortElements() {
        this.dashboardElements = this.dashboardElements.sort((a, b) => {
            if (a.position.top == b.position.top) {
                return a.position.left > b.position.left ? 1 : -1;
            } else {
                return a.position.top > b.position.top ? 1 : -1;
            }
        });
    }
}

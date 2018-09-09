import {EventEmitter, Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';


@Injectable()
export class dashboardlayout {
    dashboardData: any = {};
    dashboardgrid: Array<any> = [];
    dashboardId: string = '';
    dashboardElements: Array<any> = [];
    expandedRows: any[] = [];
    elementWidth: number = 100;
    boxMargin: number = 5;
    columns: number = 9;
    paddingRight = 20;
    editMode: boolean = false;
    editing: string = '';
    editModal: boolean = false;
    mainContainer: any = undefined;
    isMoving: boolean = false;

    constructor(private backend: backend, private modelutilities: modelutilities, public model: model,  private modal: modal) {
    }

    get dashboardGrid() {
        return this.dashboardgrid;
    }

    set dashboardGrid(val) {
        if (this.expandedRows.length > 0)
            this.dashboardgrid = this.dashboardgrid.concat(this.expandedRows);
        this.dashboardgrid = val;
    }

    get elementHeight() {
        return this.mainContainer ? this.mainContainer.height / this.columns : 100;
    }

    /*
     * calculate the GRID
     */
    calculateGrid() {
        // rect = container div
        this.elementWidth = (this.mainContainer.width - this.paddingRight) / this.columns;
        this.dashboardGrid = [];
        let rowIndex = 0,
            mainContainerHeight = this.mainContainer.height;

        if (this.expandedRows.length > 0)
            mainContainerHeight = this.mainContainer.height + ((this.elementHeight - 2 * this.boxMargin) * this.expandedRows.length);

        while ((rowIndex * this.elementHeight) < mainContainerHeight) {
            let colIndex = 0;
            let dashBoardRow = [];
            while (colIndex < this.columns) {
                dashBoardRow.push({
                    width: ((this.mainContainer.width - this.paddingRight) / this.columns) - (2 * this.boxMargin),
                    height: this.elementHeight - (2 * this.boxMargin),
                    top: ((rowIndex * this.elementHeight) + this.boxMargin),
                    left: (colIndex * (this.mainContainer.width - this.paddingRight) / this.columns) + this.boxMargin
                });
                colIndex++;
            }
            this.dashboardGrid.push(dashBoardRow);
            rowIndex++;
        }
    }

    /*
     * translate for style from index to pixels on the dashboard
     */
    getElementStyle(top, left, width, height) {
        let style: any = {};

        style.top = top * this.elementHeight + this.boxMargin;
        style.left = left * this.elementWidth + this.boxMargin;
        style.width = width * this.elementWidth - 2 * this.boxMargin;
        style.height = height * this.elementHeight - 2 * this.boxMargin;
        return style;
    }

    // function to drop an item
    dropElement(id, movex, movey, mouseTarget, mouseLast) {
        // item.position count per column
        this.dashboardElements.some(item => {
            if (item.id === id) {
                let moveXDiff = Math.round(movex / this.elementWidth),
                    moveYDiff = Math.round(movey / this.elementHeight);

                const canDrop = this.canDrop(id, item, movex, movey, mouseLast, mouseTarget);
                switch (mouseTarget) {
                    case 'content':
                        if (canDrop.left)
                            item.position.left += moveXDiff;

                        if (canDrop.top)
                            item.position.top += moveYDiff;
                        break;
                    case 'left':
                        if (canDrop.left) {
                            item.position.width -= moveXDiff;
                            item.position.left += moveXDiff;
                        }
                        break;
                    case 'right':
                        if (canDrop.left)
                            item.position.width += moveXDiff;
                        break;
                    case 'top':
                        if (canDrop.top) {
                            item.position.height -= moveYDiff;
                            item.position.top += moveYDiff;
                        }
                        break;
                    case 'bottom':
                        if (canDrop.top)
                            item.position.height += moveYDiff;
                        break;
                }
                window.dispatchEvent(new Event('resize'));
                this.handelExpand(item.position.top + (item.position.height - 1));
                return true;
            }
        });
    }

    canDrop(id, item, movex, movey, mouseLast, mouseTarget) {

        let left: boolean = true,
            top: boolean = true,
            moveXDiff = Math.round(movex / this.elementWidth),
            moveYDiff = Math.round(movey / this.elementHeight),
            currentElOldLeft: number = item.position.left,
            currentElOldRight: number = item.position.left + (item.position.width - 1),
            currentElOldTop: number = item.position.top,
            currentElOldBottom: number = item.position.top + (item.position.height - 1),
            currentElLeft: number = currentElOldLeft,
            currentElWidth: number = item.position.width,
            currentElRight = currentElOldRight,
            currentElTop: number = currentElOldTop,
            currentElHeight: number = item.position.height,
            currentElBottom = currentElOldBottom;

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

            let elLeft: number = element.position.left,
                elRight: number = element.position.left + (element.position.width - 1),
                elTop: number = element.position.top,
                elBottom: number = element.position.top + (element.position.height - 1),
                leftIn: boolean = (currentElLeft >= elLeft && currentElLeft <= elRight),
                rightIn: boolean = (currentElRight <= elRight && currentElRight >= elLeft),
                topIn: boolean = (currentElTop >= elTop && currentElTop <= elBottom),
                bottomIn: boolean = (currentElBottom <= elBottom && currentElBottom >= elTop),
                xIn: boolean = ((rightIn || leftIn) && (topIn || bottomIn) && element.id != id),
                yIn: boolean = ((topIn || bottomIn) && (leftIn || rightIn) && element.id != id),
                overflowedX: boolean = (currentElLeft < 0 || currentElRight > (this.columns - 1)),
                overflowedTop: boolean = (currentElTop < 0),
                isCoveredY: boolean = ((currentElTop < elTop && currentElBottom > elBottom) &&
                    (currentElLeft <= elRight && currentElRight >= elLeft) && element.id != id),
                isCoveredX: boolean = ((currentElRight > elRight && currentElLeft < elLeft) &&
                    (currentElTop <= elBottom && currentElBottom >= elTop) && element.id != id);

            switch (mouseTarget) {
                case 'content':
                    if (xIn || yIn || isCoveredX || isCoveredY || overflowedX || overflowedTop) {
                        left = false;
                        top = false
                    }
                    break;
                case 'left':
                    if (xIn || isCoveredX || overflowedX || (currentElLeft > currentElRight))
                        left = false;
                    break;
                case 'right':
                    if (xIn || isCoveredX || overflowedX || (currentElRight < currentElLeft))
                        left = false;
                    break;
                case 'top':
                    if (yIn || isCoveredY || overflowedTop || (currentElTop > currentElBottom))
                        top = false;
                    break;
                case 'bottom':
                    if (yIn || isCoveredY || overflowedTop || (currentElBottom < currentElTop))
                        top = false;
                    break;
            }
        }

        return {top: top, left: left};
    }

    handelExpand(currentElBottom) {
        let counter = 0;
        while (counter < (currentElBottom - (this.dashboardGrid.length - 1))) {
            this.expandedRows.push(this.dashboardGrid[0]);
            counter++;
        }
        let reservedFields = 0;
        for (let element of this.dashboardElements) {
            reservedFields += element.position.width * element.position.height;
        }
        if (reservedFields >= (+this.dashboardGrid.length * +this.dashboardGrid[0].length))
            this.expandedRows.push(this.dashboardGrid[0]);

        this.calculateGrid();
    }

    addDashlet(position) {

        this.modal.openModal('DashboardAddElement').subscribe(modalRef => {
            modalRef.instance.addDashlet.subscribe(dashlet => {
                if (dashlet !== false) {
                    this.editing = this.modelutilities.generateGuid();
                    this.dashboardElements.push({
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
                    });
                }
            })
        });
    }

    deleteDashlet(id) {
        this.dashboardElements.some((dashlet, index) => {
            if (dashlet.id === id) {
                this.dashboardElements.splice(index, 1);
                return true;
            }
        });
    }

    loadDashboard(id) {
        if (id != this.dashboardId) {
            this.dashboardId = id;
            this.model.module = 'Dashboards';
            this.model.id = id;
            this.model.getData(true).subscribe(loaded => {
                this.dashboardData = this.model.data;
                this.dashboardElements = this.model.data.components;
            });
        }
    }

    cancelEdit() {
        this.expandedRows = [];
        this.calculateGrid();
        this.editMode = false;
        this.dashboardElements = JSON.parse(JSON.stringify(this.dashboardData.components));
    }

    saveDashboard() {
        this.editMode = false;
        this.backend.postRequest('dashboards/' + this.dashboardId, {}, this.dashboardElements).subscribe(data => {
            this.dashboardData.components = this.dashboardElements.slice(0);
        });
    }
}
import {ComponentRef, Injectable} from "@angular/core";
import {LandscapeItemI, LandscapeItemPoints} from "../interfaces/deployment.interfaces";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {ObjectModalModuleLookup} from "../../../objectcomponents/components/objectmodalmodulelookup";
import {take} from "rxjs/operators";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";

/**
 * handle the landscape svg
 */
@Injectable()
export class DeploymentSystemLandscapeService {

    /**
     * holds the view container element
     */
    public container: HTMLElement;
    /**
     * holds the default box size
     */
    public defaultBoxSize = {
        height: 100,
        width: 100,
    };
    /**
     *  holds the cell size
     */
    public cellSize: number = 50;
    /**
     * holds the diagram data array
     */
    public data: LandscapeItemI[] = [
        {
            id: 'b75a29c9-9d64-3742-6fc7-dd1051c5df3b',
            type: 'item',
            name: {
                text: 'Master',
                position: {x: 810, y: 30}
            },
            data: {
                "id": "b75a29c9-9d64-3742-6fc7-dd1051c5df3b",
                "name": "Master",
                "url": "http://localhost/crm",
                "sys_username": "mehyar@spicecrm.com",
                "sys_password": "1111Aa"
            },
            position: {x: 800, y: 20},
            style: {
                'top': '20px',
                'left': '50%',
                width: `${this.defaultBoxSize.width}px`,
                height: `${this.defaultBoxSize.height}px`
            },
        }
    ];
    /**
     * holds a json string backup of the data array
     * @private
     */
    private dataBackup: string;

    constructor(private modal: modal,
                private model: model,
                private toast: toast,
                private language: language,
                private backend: backend) {
    }

    /**
     * remove the old connectors and recreate
     * @param item
     */
    public adjustConnectors(item: LandscapeItemI) {

        const connectors = this.data.filter(e => e.type == 'connector' && (e.items.source.id == item.id || e.items.target.id == item.id));

        connectors.forEach(c => {
            const source = this.data.find(e => e.id == c.items.source.id);
            const target = this.data.find(e => e.id == c.items.target.id);
            c.path = this.drawConnectionPath(source, target);
        });
    }

    /**
     * download svg content of the structure
     */
    public exportSVG() {

        const svgElement = this.container.getElementsByClassName('spice-deployment-system-landscape-view-svg')[0].cloneNode(true) as HTMLElement;

        const buttons = svgElement.querySelectorAll('foreignObject');
        Array.from(buttons).forEach(b => b.remove());

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);


        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        const downloadLink = document.createElement('a');
        downloadLink.download = 'svg';
        downloadLink.href = url;
        downloadLink.onclick = (event: MouseEvent) => {
            document.body.removeChild(event.target as Node);
        };
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    /**
     * add new related system
     * @param sourceItem
     * @param element
     */
    public addNewRelatedSystem(sourceItem: LandscapeItemI, element: HTMLElement) {

        this.model.addModel().subscribe(data => {

            if (!data) return;

            this.backup();

            this.pushNewItem(sourceItem, element, data);

            this.saveRelationRequest(sourceItem, {data}, element);
        })
    }

    /**
     * select existing related system
     * @param sourceItem
     * @param element
     * @param targetItem
     */
    public selectRelatedSystem(sourceItem: LandscapeItemI, element: HTMLElement, targetItem?) {

        this.backup();

        if (!!targetItem) {

            if (this.data.some(e => e.id == targetItem.id)) {
                this.connect(sourceItem, targetItem);
            } else {
                this.pushNewItem(sourceItem, element, targetItem);
            }

            this.saveRelationRequest(sourceItem, targetItem.data, element);
            return;
        }

        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal: ComponentRef<ObjectModalModuleLookup>) => {

            selectModal.instance.module = 'SystemDeploymentSystems';

            selectModal.instance.selectedItems.pipe(take(1)).subscribe(items => {

                const data = items[0];

                if (this.data.some(e => e.id == data.id)) {
                    this.connect(sourceItem, this.data.find(e => e.id == data.id));
                } else {
                    this.pushNewItem(sourceItem, element, data);
                }

                this.saveRelationRequest(sourceItem, items[0], element);
            });
        });
    }

    /**
     * create a connector for two items
     * @param source
     * @param target
     * @private
     */
    public connect(source: LandscapeItemI, target: LandscapeItemI) {

        const existingConnector = this.data.find(e => e.type == 'connector' && (
                (e.items.target.id == source.id && e.items.source.id == target.id) || (e.items.target.id == target.id && e.items.source.id == source.id)
        ));

        if (existingConnector) {

            if (existingConnector.items.target.id == source.id) {
                existingConnector.items.source.hasArrow = true;
            }
            return;
        }

        this.data.push({
            id: `${this.data.length + 1}`,
            type: 'connector',
            path: this.drawConnectionPath(source, target),
            items: {
                source: {id: source.id, hasArrow: false},
                target: {id: target.id, hasArrow: true}
            }
        });
    }

    /**
     * make an api request to add the relation between the two system on the db
     * @param sourceItem
     * @param data
     * @param element
     * @private
     */
    private saveRelationRequest(sourceItem: LandscapeItemI, data , element: HTMLElement) {

        this.backend.postRequest(`configuration/deployment/systems/related/${sourceItem.id}`, null, {data}).subscribe({
            next: res => {

                if (!res.success) {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                    this.revertChanges();
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                }

            }, error: () => {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                this.revertChanges();
            }
        });
    }

    /**
     * backup the data array to a json string
     * @private
     */
    private backup() {
        this.dataBackup = JSON.stringify(this.data);
    }

    /**
     * restore the data backup on failure
     * @private
     */
    private revertChanges() {
        this.data = JSON.parse(this.dataBackup);
    }

    /**
     * push the new item to the data array
     * @param sourceItem
     * @param element
     * @param data
     * @private
     */
    private pushNewItem(sourceItem: LandscapeItemI, element: HTMLElement, data) {
        const {y, x} = this.getPossibleCoordinate(element);

        const newItem: LandscapeItemI = {
            id: data.id,
            data,
            name: {
                text: data.name,
                position: {x: x + 10, y: y + 10}
            },
            type: 'item',
            position: {x, y},
            style: {
                width: `${this.defaultBoxSize.width}px`,
                height: `${this.defaultBoxSize.height}px`,
                top: `${top}px`,
                left: `${x}px`,
            }
        };

        this.data.push(newItem);

        this.connect(sourceItem, newItem);
    }

    /**
     * get possible position coordinate for the new item
     * @param element
     * @private
     */
    private getPossibleCoordinate(element: HTMLElement) {

        const direction = {x: 'middle', y: 'bottom'};
        const distance = {x: 0, y: 50};
        const viewContainerRect = this.container.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        let y = rect.top - viewContainerRect.top;
        let x = rect.left - viewContainerRect.left;

        if (direction.x == 'middle') {
            x = x + distance.x
        }
        if (direction.y == 'bottom') {
            y = y + this.defaultBoxSize.height + distance.y
        }

        const bottomRowItems = this.data.filter(e =>
            (e.type == 'item' && (
                y >= e.position.y && y <= (e.position.y + this.defaultBoxSize.height)
            ))
        );

        bottomRowItems.sort((a, b) => a.position.x > b.position.x ? 1 : 0);
        const last = bottomRowItems[bottomRowItems.length - 1];

        if (last) x = last.position.x + this.defaultBoxSize.width + this.cellSize;


        return {y, x};
    }

    /**
     * draw svg connection path
     * @param source
     * @param target
     * @private
     */
    private drawConnectionPath(source: LandscapeItemI, target: LandscapeItemI): { line: string, sourceArrow: string, targetArrow: string } {

        const sourcePoints = this.getItemBoxPoints(source.position.x, source.position.y);
        const targetPoints = this.getItemBoxPoints(target.position.x, target.position.y);

        // first position the target is exactly underneath the source
        let startPosition = sourcePoints.bottomCenter;
        let endPosition = targetPoints.topCenter;

        const sourceBottomIsBelow = sourcePoints.bottomCenter.y > targetPoints.topCenter.y;
        const sourceIsOnTheRight = sourcePoints.leftMiddle.x > targetPoints.rightMiddle.x;

        if (sourceBottomIsBelow && sourceIsOnTheRight) {
            startPosition = sourcePoints.leftMiddle;
            endPosition = targetPoints.rightMiddle;
        } else if (sourceBottomIsBelow) {
            startPosition = sourcePoints.rightMiddle;
            endPosition = targetPoints.leftMiddle;
        }

        // if source top is below the bottom center
        if (sourcePoints.topCenter.y > targetPoints.bottomCenter.y) {
            startPosition = sourcePoints.topCenter;
            endPosition = targetPoints.bottomCenter;
        }

        // draw the middle point if needed
        let middlePoints = '';

        if (startPosition.x != endPosition.x) {
            const middleY = (startPosition.y + ((endPosition.y - startPosition.y)) / 2);
            middlePoints = `${startPosition.x},${middleY} ${endPosition.x},${middleY}`;
        }

        if (startPosition == sourcePoints.leftMiddle || startPosition == sourcePoints.rightMiddle) {
            const middleX = (startPosition.x + ((endPosition.x - startPosition.x)) / 2);
            middlePoints = `${middleX},${startPosition.y} ${middleX},${endPosition.y}`;
        }

        return {
            line: `${startPosition.x},${startPosition.y} ${middlePoints} ${endPosition.x},${endPosition.y}`,
            sourceArrow: this.drawConnectionArrow(startPosition, sourcePoints),
            targetArrow: this.drawConnectionArrow(endPosition, targetPoints),
        }
    }

    /**
     * draw connection arrow
     * @param endPosition
     * @param targetPoints
     * @private
     */
    private drawConnectionArrow(endPosition, targetPoints): string {

        const arrowSize = 8;
        const forwardX = endPosition.x + arrowSize;
        const backwardX = endPosition.x - arrowSize;
        const forwardY = endPosition.y + arrowSize;
        const backwardY = endPosition.y - arrowSize;
        const arrowEnd = `L ${endPosition.x}, ${endPosition.y}`;

        let arrow = `M ${forwardX}, ${backwardY} L ${backwardX}, ${backwardY}  ${arrowEnd}`;

        if (endPosition == targetPoints.rightMiddle) {
            return `M ${forwardX}, ${forwardY} L ${forwardX}, ${backwardY} ${arrowEnd}`;
        } else if (endPosition == targetPoints.leftMiddle) {
            return `M ${backwardX}, ${forwardY} L ${backwardX}, ${backwardY} ${arrowEnd}`;
        } else if (endPosition == targetPoints.bottomCenter) {
            return `M ${forwardX}, ${forwardY} L ${backwardX}, ${forwardY} ${arrowEnd}`;
        }

        return arrow;
    }

    /**
     * get item rect
     * @private
     * @param left
     * @param top
     */
    private getItemBoxPoints(left: number, top: number): LandscapeItemPoints {
        return {
            topLeft: {
                x: left,
                y: top
            },
            topCenter: {
                x: left + (this.defaultBoxSize.width / 2),
                y: top
            },
            topRight: {
                x: left + this.defaultBoxSize.width,
                y: top
            },
            rightMiddle: {
                x: left + this.defaultBoxSize.width,
                y: top + (this.defaultBoxSize.height / 2)
            },
            rightBottom: {
                x: left + this.defaultBoxSize.width,
                y: top + this.defaultBoxSize.height
            },
            bottomCenter: {
                x: left + (this.defaultBoxSize.width / 2),
                y: top + this.defaultBoxSize.height
            },
            bottomLeft: {
                x: left,
                y: top + this.defaultBoxSize.height
            },
            leftMiddle: {
                x: left,
                y: top + (this.defaultBoxSize.height / 2)
            }
        };
    }
}

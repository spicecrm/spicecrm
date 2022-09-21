import {Injectable, Renderer2} from "@angular/core";
import {LandscapeItemI} from "../interfaces/deployment.interfaces";

@Injectable()
export class DeploymentSystemLandscapeService {

    public container: HTMLElement;
    public defaultBoxSize = {
        height: 100,
        width: 100,
    };
    public cellSize: number = 50;

    public data: LandscapeItemI[] = [
        {
            id: '0',
            type: 'item',
            name: {
                text: 'First Item',
                position: {x: 810, y: 30}
            },
            position: {left: 800, top: 20},
            style: {
                'top': '20px',
                'left': '50%',
                width: `${this.defaultBoxSize.width}px`,
                height: `${this.defaultBoxSize.height}px`
            },
        }
    ];

    constructor(public renderer: Renderer2) {
    }

    public add(source: LandscapeItemI, element: HTMLElement) {

        const {top, left} = this.getPossibleCoordinate(element);

        const newItem: LandscapeItemI = {
            id: `${this.data.length + 1}`,
            name: {
                text: 'New Item',
                position: {x: left + 10, y: top + 10}
            },
            type: 'item',
            position: {left, top},
            style: {
                width: `${this.defaultBoxSize.width}px`,
                height: `${this.defaultBoxSize.height}px`,
                top: `${top}px`,
                left: `${left}px`,
            }
        };

        this.data.push(newItem);

        this.connect(source, newItem);
    }

    /**
     * Create a connector for two items
     * @param source
     * @param target
     * @private
     */
    private connect(source: LandscapeItemI, target: LandscapeItemI) {
        this.data.push({
            id: `${this.data.length + 1}`,
            type: 'connector',
            path: this.drawConnectionPath(source, target),
            items: {source: source.id, target: target.id}
        });
    }

    /**
     * remove the old connectors and recreate
     * @param item
     */
    public adjustConnectors(item: LandscapeItemI) {

        const connectors = this.data.filter(e => e.type == 'connector' && (e.items.source == item.id || e.items.target == item.id));

        connectors.forEach(c => {
            const source = this.data.find(e => e.id == c.items.source);
            const target = this.data.find(e => e.id == c.items.target);
            c.path = this.drawConnectionPath(source, target);
        });
    }

    private getPossibleCoordinate(element: HTMLElement) {

        const direction = {x: 'middle', y: 'bottom'};
        const distance = {x: 0, y: 50};
        const viewContainerRect = this.container.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        let top = rect.top - viewContainerRect.top;
        let left = rect.left - viewContainerRect.left;

        if (direction.x == 'middle') {
            left = left + distance.x
        }
        if (direction.y == 'bottom') {
            top = top + this.defaultBoxSize.height + distance.y
        }

        const bottomRowItems = this.data.filter(e =>
            (e.type == 'item' && (
                top >= e.position.top && top <= (e.position.top + this.defaultBoxSize.height)
            ))
        );

        bottomRowItems.sort((a, b) => a.position.left > b.position.left ? 1 : 0);
        const last = bottomRowItems[bottomRowItems.length - 1];

        if (last) left = last.position.left + this.defaultBoxSize.width + this.cellSize;


        return {top, left};
    }

    /**
     * draw svg connection path
     * @param source
     * @param target
     * @private
     */
    private drawConnectionPath(source: LandscapeItemI, target: LandscapeItemI): {line: string, arrow: string} {

        const sourcePoints = this.getItemRect(source.position.left, source.position.top);
        const targetPoints = this.getItemRect(target.position.left, target.position.top);

        let startPosition = sourcePoints.bottomCenter;
        let endPosition = targetPoints.topCenter;

        if (sourcePoints.bottomCenter.y > targetPoints.topCenter.y && sourcePoints.leftMiddle.x > targetPoints.rightMiddle.x) {
            startPosition = sourcePoints.leftMiddle;
            endPosition = targetPoints.rightMiddle;
        } else if (sourcePoints.bottomCenter.y > targetPoints.topCenter.y) {
            startPosition = sourcePoints.rightMiddle;
            endPosition = targetPoints.leftMiddle;
        }

        if (sourcePoints.topCenter.y > targetPoints.bottomCenter.y) {
            startPosition = sourcePoints.topCenter;
            endPosition = targetPoints.bottomCenter;
        }

        return {
            line: `M ${startPosition.x}, ${startPosition.y} L ${endPosition.x}, ${endPosition.y}`,
            arrow: `M ${endPosition.x + 8}, ${endPosition.y - 8} L ${endPosition.x - 8}, ${endPosition.y - 8}  L ${endPosition.x}, ${endPosition.y}`
        }
    }

    /**
     * get item rect
     * @private
     * @param left
     * @param top
     */
    private getItemRect(left: number, top: number) {
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

    /**
     * download svg content of the structure
     */
    public svg() {

        const svgElement = this.container.getElementsByClassName('spice-deployment-system-landscape-view-svg')[0].cloneNode(true) as HTMLElement;

        const buttons = svgElement.querySelectorAll('foreignObject');
        Array.from(buttons).forEach(b => b.remove());

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);


        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        const downloadLink = document.createElement('a');
        downloadLink.download = 'svg';
        downloadLink.href = url;
        downloadLink.onclick = (event: MouseEvent) => {
            document.body.removeChild(event.target as Node);
        };
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
}

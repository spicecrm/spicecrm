import {Injectable} from "@angular/core";
import {CdkDropList} from "@angular/cdk/drag-drop";

/** @ignore */
declare var _;

@Injectable()
export class SpicePageBuilderService {
    /**
     * hold the unique dom id for the panel drop list
     */
    public contentListId: string;
    /**
     * hold the drag placeholder node to keep element in place while dragging
     */
    public dragPlaceholderNode: Node;
    /**
     * hold the current hovered item type
     */
    public isMouseIn: 'section' | 'content';
    /**
     * page structure object
     */
    public page: { containers, style, type } = {
        style: {'background-color': 'grey'},
        type: 'page',
        containers: [
            {
                type: 'container',
                style: {
                    'background-color': '#C7FFD6',
                    'padding': '8px',
                    'display': 'block',
                },
                sections: []
            }
        ]
    };
    /**
     * holds the drop list group reference
     */
    public dropListGroup: any;
    /**
     * holds the current editing element to be edited in the panel
     */
    public editingElement: any;

    constructor() {
        this.contentListId = _.uniqueId('panel-drop-list-');
    }
    /**
     * add drop list to group
     * @param dropList
     */
    public addDropListToGroup(dropList: CdkDropList) {
        if (this.dropListGroup && !this.dropListGroup._items.has(dropList)) {
            this.dropListGroup._items.add(dropList);
            this.dropListGroup._items.forEach(list => list._group = this.dropListGroup);
        }
    }
}

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
     * hold the available content elements
     */
    public readonly contentElements: any[] = [
        {
            type: 'text',
            style: {
                'padding': '4px',
                'height': '200px',
                'width': '100%',
                'background-color': '#e7e7e7',
            },
            content: 'Write Text Here'
        },
        {
            type: 'image',
            style: {},
            src: ''
        },

    ];

    /**
     * default style attributes definition
     */
    public defaultStyleAttributes: Array<{ name, type, suffix? }> = [
        {name: 'padding', type: 'sides', suffix: 'px'},
        {name: 'margin', type: 'sides', suffix: 'px'},
        {name: 'height', type: 'text', suffix: 'px'},
        {name: 'background-color', type: 'color'},
        {name: 'color', type: 'color'},
    ];

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

import {Injectable} from "@angular/core";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {Observable, Subject} from "rxjs";
import {modal} from "../../../services/modal.service";

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
                'width': '100%',
                'background-color': '#e7e7e7',
            },
            content: 'Write text here...',
            icon: 'text'
        },
        {
            type: 'image',
            style: {},
            src: '',
            icon: 'image'
        },
        {
            type: 'divider',
            style: {
                'margin-top': '8px',
                'padding-top': '8px',
                'border-top-width': '1px',
                'border-top-style': 'solid',
                'border-top-color': '#dddbda'
            },
            icon: 'dash'
        },
        {
            type: 'spacer',
            style: {
                height: '100px',
                width: '100%'
            },
            icon: 'steps'
        },
        {
            type: 'button',
            text: 'New Button',
            url: '#',
            style: {
                'border-radius': '4px 4px 4px 4px',
                'background-color': '#ca1b21',
                'color': '#ffffff',
                'padding': '4px 4px 4px 4px',
                'width': '100px',
                'text-align': 'center'
            },
            icon: 'link'
        },
        {
            type: 'code',
            content: 'Write code here...',
            style: {
            },
            icon: 'insert_tag_field'
        }

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

    constructor(private modal: modal) {
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

    /**
     * open media file picker modal and return the src of the image
     * @return src: string
     */
    public openMediaFilePicker(): Observable<string> {

        const response: Subject<string> = new Subject();

        this.modal.openModal('MediaFilePicker').subscribe(componentRef => {
            componentRef.instance.answer.subscribe(image => {

                if (!image) {
                    response.next(undefined);
                    response.complete();
                }

                if (image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            response.next(!uploadimage ? undefined : 'https://cdn.spicecrm.io/' + uploadimage);
                            response.complete();
                        });
                    });
                } else {
                    response.next(!image.id ? undefined : 'https://cdn.spicecrm.io/' + image.id);
                    response.complete();
                }
            });
        });

        return response.asObservable();
    }
}

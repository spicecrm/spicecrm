import {ChangeDetectorRef, EventEmitter, Injectable, Injector} from "@angular/core";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {Observable, Subject} from "rxjs";
import {modal} from "../../../services/modal.service";
import {
    ColumnI,
    ContentElementI,
    CustomElement,
    PanelElementI,
    SectionI,
    TagElementI
} from "../interfaces/spicepagebuilder.interfaces";
import {InputRadioOptionI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {helper} from "../../../services/helper.service";
import {configurationService} from "../../../services/configuration.service";

/** @ignore */
declare var _;

@Injectable()
export class SpicePageBuilderService {
    /**
     * loading flag for data retrieve
     */
    public isLoading: boolean = false;
    /**
     * user predefined sections
     */
    public customSections: CustomElement[] = [];
    /**
     * user predefined items
     */
    public customItems: CustomElement[] = [];
    /**
     * hold a response subject to emit the data to the page builder modal listener
     */
    public response = new EventEmitter<any>();
    /**
     * hold the unique dom id for the panel drop list
     */
    public contentListId: string;
    /**
     * hold the drag placeholder node to keep element in place while dragging
     */
    public dragPlaceholderNode: Node;
    /**
     * hold the drag placeholder node to keep element in place while dragging
     */
    public defaultPlaceholderHeight: number = 200;
    /**
     * hold the current hovered item type
     */
    public isMouseIn: 'section' | 'content';
    /**
     * page structure object
     */
    public _page: TagElementI = {
        tagName: 'mjml',
        attributes: {},
        children: [
            {
                tagName: 'body',
                attributes: {
                    'background-color': '#ffffff',
                    'width': '550px'
                },
                children: []
            },
            // todo complete the feature of custom attributes after the bug fix in mjml api
            // https://github.com/mjmlio/mjml/issues/2697
            {
                tagName: 'head',
                children: [
                    {
                        tagName: 'html-attributes',
                        children: [
                            {
                                tagName: 'selector',
                                attributes: {path: '.spice-trackable-link a'},
                                children: [
                                    {
                                        tagName: 'html-attribute',
                                        attributes: {name: 'data-trackinglink'},
                                        content: ''
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }
        ]
    };


    public rssDateItem = {
        tagName: 'text',
        content: 'RSS-ITEM-DATE-PLACEHOLDER',
        attributes: {
            'css-class': 'rss-date',
            'font-size': '10px',
            'line-height': '14px',
            'padding': '4px',
            'container-background-color': '#ffffff'
        }
    };
        /**
     * hold the available content elements
     */
    public readonly panelElements: PanelElementI[] = [
        {
            tagName: 'text',
            label: 'LBL_TEXT',
            content: 'Write text here...',
            icon: 'text',
            attributes: {
                'font-size': '13px',
                'line-height': '14px',
                'padding': '4px',
                'container-background-color': '#ffffff'
            }
        },
        {
            tagName: 'image',
            label: 'LBL_IMAGE',
            icon: 'image',
            attributes: {
                align: 'center',
                padding: '4px',
                target: '_blank'
            }
        },
        {
            tagName: 'divider',
            label: 'LBL_DIVIDER',
            icon: 'dash',
            attributes: {
                'padding': '8px',
                'border-width': '2px',
                'width': '100%',
                'border-color': '#a2a2a2'
            }
        },
        {
            tagName: 'spacer',
            label: 'LBL_SPACER',
            icon: 'steps',
            attributes: {
                'height': '50px',
                'vertical-align': 'middle'
            }
        },
        {
            tagName: 'button',
            label: 'LBL_BUTTON',
            content: 'New Button',
            icon: 'link',
            attributes: {
                'border-radius': '4px',
                'background-color': '#ca1b21',
                'color': '#ffffff',
                'padding': '4px',
                'inner-padding': '4px',
                'width': '100px',
                'align': 'center',
                'font-size': '13px',
                'text-align': 'center',
                'line-height': '14px',
                'target': '_blank',
                'vertical-align': 'middle',
                'href': '#',
            }
        },
        {
            tagName: 'raw',
            label: 'LBL_HTML_CODE',
            content: 'Write code here...',
            icon: 'insert_tag_field',
            attributes: {}
        },
        {
            tagName: 'rss',
            label: 'LBL_RSS_FEED',
            icon: 'news',
            content: 'Enter RSS name here...',
            href: '#',
            showDate: '1',
            count: '3',
            attributes: {
                'font-size': '16px',
                'css-class': 'rss-container'
            },
            children: [
                {
                    tagName: 'column',
                    attributes: { 'width': '100%' },
                    children: [
                        {
                            tagName: 'section',
                            attributes: {
                                'css-class': 'rss-item',
                                'padding': '0'
                            },
                            children: [
                                {
                                    tagName: 'column',
                                    attributes: {
                                        'css-class': 'rss-item-image-column',
                                        'width': '35%',
                                        'padding': '0 0 5px 0',
                                    },
                                    children: [
                                        {
                                            tagName: 'image',
                                            attributes: {
                                                'css-class': 'rss-image',
                                                'align': 'right',
                                                'width': '100%',
                                                'padding': '4px',
                                                "fluid-on-mobile": "true",
                                                'target': '_blank',
                                                'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAaVBMVEVHcEzhWgDhWgDhWgDhWgDhWgDhWgDhWgDhWgDhWgDhWgDhWgDhWgD////hWADiXwfjZA/kahnlcCHmdSnnejHogDrphUPqi0zhVwD2zLDun2r86+H++vf64M/sklfxroHzvJf99O3418HwywNDAAAADHRSTlMAPut1Cqe90RIRVSoKNZleAAAEvUlEQVRo3u2a13arMBBF47jFDh6BqBKd///IK+wAGjXTkqc7K0/Y8da0MwLx8fHfttjp9rXRbic34HA8X66b7XI+Hmyg0/3y6e1kn5e7EfN99na187fOOFzlbwB4Hplldsr1oDHkSAHxaRQnSZq8LH5Z9LLwafRpQSD+evN9nfepUL5lP0iYpJWw9GUGkMR5IXqK4Ki+oIidzpIXYaoCEAE5MjCeCD14Zzn79+l6kIwEqw908uHlwotgSNBdcuQyXhVuGAjRKoKwy0nPOolm5YHKBN9VZFLuj8O1aCnhXRl7xxFyHmO1wgfibkk1JUGyM0FOyu3VJCTem9C3yu0H8vWChLsTesgXgvjxrIbwFxB0CEUASpc1xDwIiSbZiDiv0jgKtxJUCPhTlGiSP4o2LztW8yQM1hM0T6iUhzh/DNbmrK5Cfx1Bh0iZjibI0wQo9vs5thFC5GIKFUjvUVdHZAUHQ6hUTGH5MFjLqmAxRocMtUSNEGFlHXqwBSJVa2CDiPQsxGCI3NN+93g4MHRB0BSIpBpOiAga92EdRBYmwh5uY/HcmKmQqanfQh5tPdMZRbukpiacsa7M28LlTARrIPL2rk8MjVLesNxGyqs5IVOkXjUAyDIgQVKz3EgpagJbIROLhJy1JkwTwD6Q3rKMRLWpQRmF3SBPhwJuwHTvKIsgNsw7igPSp1zXDgDatAspdggRu+6I+oKl/AB4iaY4zJl9KwT88jnjn4NX8QiCRm2cxlXJTshPK4iBmODBC16ltk3tbYI8QWUd48EbK/kvKtgKeQ7eVA4JhEpicruOzYeIxSIMUEWmmVWTHRDD0CqE7MKUfjYzLcsg/dyd1gsUf6WNYR8ImiGgbJtsAbM3o3XG5+k4QyDBlcx3gzxaPuY/46grS7O8rIGgSdXMyL1Du6q6YZ158E4UCNBa8hAWqrCoVp8m3DR4i3HJkCJNbtbNeCC00gdvwc0BM7oyZ2hBRmJthrTJEDC8M69hw2SMmZKdqZI4umyYLLMhQHiujhBj2/INEJGeqDOLOyBXGNm0kRAD0RgwLNitLvnLtkS+pfW4O/XLtkTgM9OcAiqnq9Nk8i2k75TpnzLc4EPrQeOMlxvSd2IcR/60dYc4N7QeJIWrvpwQIBUTNyht2UQTxhR/XMVafbkgYooPC8xHdce/N7Qe1LJ/aj+6BFKerkJ3R0WUQlOkmR6vIpkPwTeNU+uh683QQnKr8Gw2JMViVY6VWZmkijn03gFRNjxDZDxPXvUQmowb1/Nut6I99qiNE6Q2FHFO50K0R1FjELKq0OoVNX0Rz4VQKwR99FOvWCSrbHu4SGcQEWYvL0fiGzXxk7Y0+qqhsQuxHYL1CIkrKqWfVaOeb+Y3I3KlTSUtrvRVIzCbLyvyrUHBbU42BnBH5gtkMG6Eygp9ELXaqtdC+pvppszbvOO4uyBstR8UzSPM3PJvJmMmNqphoD4LBr/io6WD20l/StUfTXJeWTy5OcavaVM5GuiXssxySCOdAO5u0xng+fcgZ/0IcH87mo+wdzXpMPP3kiIdy8oHzPva3XxUvm/aT9ZD/93s+u14fWH/rBtfxNjFj8Nvv1ICxPRKyd+8HPM3r/n80QtL/+2d/QNYM8VY/rzpWAAAAABJRU5ErkJggg=='
                                            }
                                        }
                                    ]
                                },
                                {
                                    tagName: 'column',
                                    attributes: {
                                        'css-class': 'rss-item-content-column',
                                        'width': '65%',
                                        'padding': '0 0 5px 0'
                                    },
                                    children: [
                                        {
                                            tagName: 'button',
                                            content: 'RSS-ITEM-HEADER-PLACEHOLDER',
                                            attributes: {
                                                'css-class': 'rss-header',
                                                'align': 'left',
                                                'inner-padding': '0',
                                                'background-color': '#ffffff',
                                                'color': '#000000',
                                                'href': 'RSS_ITEM_HEADER_HREF_PLACEHOLDER',
                                                'font-size': '22px',
                                                'line-height': '22px',
                                                'font-weight': '500',
                                                'text-align': 'left',
                                                'padding': '4px',
                                                'container-background-color': '#ffffff'
                                            }
                                        },
                                        this.rssDateItem,
                                        {
                                            tagName: 'text',
                                            content: 'RSS-ITEM-DESCRIPTION-PLACEHOLDER',
                                            attributes: {
                                                'css-class': 'rss-description',
                                                'font-size': '14px',
                                                'line-height': '14px',
                                                'padding': '4px',
                                                'container-background-color': '#ffffff'
                                            }
                                        },
                                    ]
                                }

                            ]
                        }
                    ]
                }
            ]
        }

    ];
    /**
     * holds the panel default section
     */
    public readonly panelDefaultSection: SectionI = {
        tagName: 'section',
        children: [],
        attributes: {padding: '0'}
    };
    /**
     * holds the panel default column
     */
    public readonly panelDefaultColumn: ColumnI = {
        tagName: 'column',
        children: [],
        attributes: {}
    };
    /**
     * align radio options
     */
    public alignOptions: InputRadioOptionI[] = [
        {
            title: 'LBL_LEFT_ALIGN',
            icon: 'left_align_text',
            value: 'left',
        },
        {
            title: 'LBL_CENTER_ALIGN',
            icon: 'center_align_text',
            value: 'center',
        },
        {
            title: 'LBL_RIGHT_ALIGN',
            icon: 'right_align_text',
            value: 'right',
        }
    ];
    /**
     * holds the drop list group reference
     */
    public dropListGroup: any;
    /**
     * holds the default suffix
     */
    public defaultSuffix: 'px' | 'rem' = 'px';

    constructor(public modal: modal,
                private toast: toast,
                private helper: helper,
                private injector: Injector,
                private configurationService: configurationService,
                private cdRef: ChangeDetectorRef,
                private backend: backend) {
        this.contentListId = _.uniqueId('panel-drop-list-');
    }

    set page(value) {
        this.emitData();
        this._page = value;
    }

    get page() {
        return this._page;
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

                const mediaFileConfig: {public_url: string} = this.configurationService.getCapabilityConfig('mediafiles');

                if (image.upload) {
                    this.modal.openModal('MediaFileUploader').subscribe(uploadComponentRef => {
                        uploadComponentRef.instance.answer.subscribe(uploadimage => {
                            response.next(!uploadimage ? undefined : mediaFileConfig.public_url + uploadimage);
                            response.complete();
                        });
                    });
                } else {
                    response.next(!image.id ? undefined : mediaFileConfig.public_url + image.id);
                    response.complete();
                }
            });
        });

        return response.asObservable();
    }

    /**
     * emits the page data to the page builder listener
     */
    public emitData(isNull?: boolean) {
        this.response.next(!isNull ? this.page : null);
    }

    /**
     * load user predefined elements
     */
    public loadCustomElements() {

        this.isLoading = true;

        this.backend.getRequest('common/PageBuilder/customElements').subscribe(res => {

            this.isLoading = false;

            res.sections.forEach(s => s.content = JSON.parse(s.content));
            this.customSections = res.sections;

            res.items.forEach(item => item.content = JSON.parse(item.content));
            this.customItems = res.items;

            this.cdRef.detectChanges();
        });
    }

    /**
     * load user predefined elements
     * @param content
     * @param type
     */
    public saveCustomElement(content: SectionI | ContentElementI, type: 'section' | 'item') {

        this.isMouseIn = undefined;

        this.modal.input('LBL_ENTER_NAME', 'LBL_NAME').subscribe(name => {

            if (!name) return;

            const element = {
                id: this.helper.generateGuid(),
                name: name,
                type: type,
                content: content,
            };

            switch (type) {
                case 'item':
                    this.customItems = [...this.customItems, {...element}];
                    break;
                case 'section':
                    this.customSections = [...this.customSections, {...element}];
                    break;
            }

            this.cdRef.detectChanges();

            element.content = JSON.stringify(element.content) as any;

            this.backend.postRequest('common/PageBuilder/customElements', null, element).subscribe({
                next: () => this.toast.sendToast('LBL_DATA_SAVED', 'success'),
                error: () => this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error')
            });
        })
    }

    /**
     * delete custom element
     * @param id
     * @param type
     */
    public deleteCustomElement(id: string, type: 'section' | 'item') {

        switch (type) {
            case 'item':
                this.customItems = this.customItems.filter(e => e.id != id);
                break;
            case 'section':
                this.customSections = this.customSections.filter(e => e.id != id);
                break;
        }

        this.cdRef.detectChanges();

        this.backend.deleteRequest('common/PageBuilder/customElements/' + id).subscribe({
            next: () => this.toast.sendToast('LBL_DATA_SAVED', 'success'),
            error: () => this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error')
        });
    }

    /**
     * set the current editing element
     */
    public openEditModal(element: ContentElementI | SectionI) {

        this.isMouseIn = undefined;
        this.cdRef.detectChanges();
        const subject = new Subject();

        this.modal.openModal('SpicePageBuilderEditor', true, this.injector).subscribe(modalRef => {
            modalRef.instance.element = JSON.parse(JSON.stringify(element));
            modalRef.instance.response.subscribe(res => {
                subject.next(res);
                if (!!res) {
                    subject.complete();
                }
            });
        });

        return subject.asObservable();
    }
}

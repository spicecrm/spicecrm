import {ChangeDetectorRef, EventEmitter, Injectable, Injector} from "@angular/core";
import {CdkDropList} from "@angular/cdk/drag-drop";
import {Observable, Subject} from "rxjs";
import {modal} from "../../../services/modal.service";
import {
    ColumnI,
    ContentElementI,
    CustomElement,
    JSONNodeI,
    PanelElementI,
    SectionI,
    StylesheetObjI,
    TagElementI
} from "../interfaces/spicepagebuilder.interfaces";
import {InputRadioOptionI} from "../../../systemcomponents/interfaces/systemcomponents.interfaces";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {helper} from "../../../services/helper.service";
import {configurationService} from "../../../services/configuration.service";
import * as mjml2html from 'mjml-browser';

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
    public response = new EventEmitter<{obj: TagElementI, html: string}>();
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
     * holds the stylesheet data
     */
    public stylesheet: StylesheetObjI;
    /**
     * predefined social media with icons
     */
    public predefinedSocialMedia = [
        { name: 'whatsapp', background: '#26d366', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjM2MiIgdmlld0JveD0iMCAwIDM2MCAzNjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzA3LjU0NiA1Mi41NjU1QzI3My43MDkgMTguNjg1IDIyOC43MDYgMC4wMTcxODk1IDE4MC43NTYgMEM4MS45NTEgMCAxLjUzODQ2IDgwLjQwNCAxLjUwNDA4IDE3OS4yMzVDMS40ODY4OSAyMTAuODI5IDkuNzQ2NDYgMjQxLjY2NyAyNS40MzE5IDI2OC44NDRMMCAzNjEuNzM2TDk1LjAyMzYgMzM2LjgxMUMxMjEuMjAzIDM1MS4wOTYgMTUwLjY4MyAzNTguNjE2IDE4MC42NzkgMzU4LjYyNUgxODAuNzU2QzI3OS41NDQgMzU4LjYyNSAzNTkuOTY2IDI3OC4yMTIgMzYwIDE3OS4zODFDMzYwLjAxNyAxMzEuNDgzIDM0MS4zOTIgODYuNDU0NyAzMDcuNTQ2IDUyLjU3NDFWNTIuNTY1NVpNMTgwLjc1NiAzMjguMzU0SDE4MC42OTZDMTUzLjk2NiAzMjguMzQ2IDEyNy43NDQgMzIxLjE2IDEwNC44NjUgMzA3LjU4OUw5OS40MjQyIDMwNC4zNThMNDMuMDM0IDMxOS4xNDlMNTguMDgzNCAyNjQuMTY4TDU0LjU0MjMgMjU4LjUzQzM5LjYzMDQgMjM0LjgwOSAzMS43NDkgMjA3LjM5MSAzMS43NjYyIDE3OS4yNDRDMzEuODAwNiA5Ny4xMDM2IDk4LjYzMzQgMzAuMjcwNyAxODAuODE3IDMwLjI3MDdDMjIwLjYxIDMwLjI4NzkgMjU4LjAxNSA0NS44MDE1IDI4Ni4xNDUgNzMuOTY2NUMzMTQuMjc2IDEwMi4xMjMgMzI5Ljc1NSAxMzkuNTYyIDMyOS43MzggMTc5LjM2NEMzMjkuNzAzIDI2MS41MTMgMjYyLjg3MSAzMjguMzQ2IDE4MC43NTYgMzI4LjM0NlYzMjguMzU0Wk0yNjIuNDc1IDIxNi43NzdDMjU3Ljk5NyAyMTQuNTM0IDIzNS45NzggMjAzLjcwNCAyMzEuODY5IDIwMi4yMDlDMjI3Ljc2MSAyMDAuNzEzIDIyNC43NzkgMTk5Ljk2NiAyMjEuNzk2IDIwNC40NTJDMjE4LjgxNCAyMDguOTM5IDIxMC4yMjggMjE5LjAyOSAyMDcuNjE1IDIyMi4wMTFDMjA1LjAwMiAyMjUuMDAyIDIwMi4zODkgMjI1LjM3MiAxOTcuOTExIDIyMy4xMjhDMTkzLjQzNCAyMjAuODg1IDE3OS4wMDMgMjE2LjE1OCAxNjEuODkxIDIwMC45MDJDMTQ4LjU3OCAxODkuMDI0IDEzOS41ODcgMTc0LjM2MiAxMzYuOTc1IDE2OS44NzVDMTM0LjM2MiAxNjUuMzg5IDEzNi43IDE2Mi45NjUgMTM4LjkzNCAxNjAuNzM5QzE0MC45NDUgMTU4LjcyOCAxNDMuNDEyIDE1NS41MDUgMTQ1LjY1NSAxNTIuODkyQzE0Ny44OTkgMTUwLjI3OSAxNDguNjM4IDE0OC40MDYgMTUwLjEzMyAxNDUuNDIzQzE1MS42MjkgMTQyLjQzMiAxNTAuODgxIDEzOS44MiAxNDkuNzY0IDEzNy41NzZDMTQ4LjY0NiAxMzUuMzMzIDEzOS42OTEgMTEzLjI4NyAxMzUuOTUyIDEwNC4zMjNDMTMyLjMxNiA5NS41OTA5IDEyOC42MjEgOTYuNzc3IDEyNS44NzkgOTYuNjMwOUMxMjMuMjY2IDk2LjUwMTkgMTIwLjI4NCA5Ni40NzYyIDExNy4yOTMgOTYuNDc2MkMxMTQuMzAyIDk2LjQ3NjIgMTA5LjQ1NCA5Ny41OTM1IDEwNS4zNDYgMTAyLjA4QzEwMS4yMzggMTA2LjU2NiA4OS42NjkxIDExNy40MDQgODkuNjY5MSAxMzkuNDQxQzg5LjY2OTEgMTYxLjQ3OCAxMDUuNzE2IDE4Mi43ODUgMTA3Ljk1OSAxODUuNzc2QzExMC4yMDIgMTg4Ljc2NyAxMzkuNTQ0IDIzNC4wMDEgMTg0LjQ2OSAyNTMuNDA4QzE5NS4xNTMgMjU4LjAyMyAyMDMuNDk4IDI2MC43ODIgMjEwLjAwNCAyNjIuODQ1QzIyMC43MzEgMjY2LjI1NyAyMzAuNDk0IDI2NS43NzYgMjM4LjIxMiAyNjQuNjI0QzI0Ni44MTYgMjYzLjMzNSAyNjQuNzEgMjUzLjc4NiAyNjguNDQgMjQzLjMyNkMyNzIuMTcgMjMyLjg2NiAyNzIuMTcgMjIzLjg5MyAyNzEuMDUzIDIyMi4wMjhDMjY5LjkzNiAyMjAuMTYzIDI2Ni45NDUgMjE5LjAzNyAyNjIuNDY3IDIxNi43OTRMMjYyLjQ3NSAyMTYuNzc3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==' },
        { name: 'facebook-noshare', background: '#3b5998', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png'},
        { name: 'twitter-noshare', background: '#55acee', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png'},
        { name: 'google-noshare', background: '#dc4e41', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png'},
        { name: 'pinterest-noshare', background: '#bd081c', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/pinterest.png'},
        { name: 'linkedin-noshare', background: '#0077b5', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/linkedin.png'},
        { name: 'tumblr-noshare', background: '#344356', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/tumblr.png'},
        { name: 'xing-noshare', background: '#296366', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/xing.png'},
        { name: 'instagram-noshare', background: '#3f729b', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/instagram.png'},
        { name: 'youtube-noshare', background: '#EB3323', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/youtube.png'},
        { name: 'snapchat-noshare', background: '#FFFA54', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/snapchat.png'},
        { name: 'web-noshare', background: '#4BADE9', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/web.png'},
        { name: 'github-noshare', background: '#000000', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/github.png'},
        { name: 'vimeo-noshare', background: '#53B4E7', icon: 'https://www.mailjet.com/images/theme/v1/icons/ico-social/vimeo.png'},
        { name: 'custom', icon: ''},
    ];
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
            tagName: 'social',
            label: 'LBL_SOCIAL_MEDIA',
            icon: 'socialshare',
            attributes: {
                'mode': 'horizontal',
                'padding': '4px',
                'align': 'center',
                'text-padding': '4px 4px 4px 0px',
                'icon-size': '20px',
                'icon-padding': '4px',
                'inner-padding': '4px',
            },
            children: []
        },
        {
            tagName: 'heading',
            label: 'LBL_HEADING',
            content: 'Heading text here...',
            icon: 'type_tool',
            attributes: {
                'font-size': '16px',
                'line-height': '24px',
                'padding': '4px'
            }
        },
        {
            tagName: 'text',
            label: 'LBL_TEXT',
            content: 'Write text here...',
            icon: 'text',
            attributes: {
                'font-size': '13px',
                'line-height': '14px',
                'padding': '4px'
            }
        },
        {
            tagName: 'image',
            label: 'LBL_MEDIA_FILES',
            icon: 'image',
            attributes: {
                align: 'center',
                padding: '0px',
                target: '_blank'
            }
        },{
            tagName: 'image-url',
            label: 'LBL_IMAGE_URL',
            content: 'Paste an Image URL...',
            icon: 'image',
            attributes: {
                align: 'center',
                padding: '0px',
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
            icon: 'button_choice',
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
        attributes: {padding: '0px'}
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
        this.response.next(!isNull ? {
            obj: this.page,
            html: this.generateHtml()
        }: undefined);
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

        this.modal.input(null, 'LBL_NAME').subscribe(name => {

            if (!name) return;

            const element: CustomElement = {
                id: this.helper.generateGuid(),
                name: name,
                type: type,
                content: content
            };

            const body = {
                ...element,
                content: JSON.stringify(element.content),
                stylesheet: this.stylesheet.content
            };

            this.backend.postRequest('common/PageBuilder/customElements', null, body).subscribe({
                next: res => {

                    element.image = res.image;

                    switch (type) {
                        case 'item':
                            this.customItems = [...this.customItems, {...element}];
                            break;
                        case 'section':
                            this.customSections = [...this.customSections, {...element}];
                            break;
                    }

                    this.cdRef.detectChanges();

                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                },
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
    public openEditModal(element: ContentElementI | SectionI, grow: boolean = true) {

        this.isMouseIn = undefined;
        this.cdRef.detectChanges();
        const subject = new Subject();

        this.modal.openModal('SpicePageBuilderEditor', true, this.injector).subscribe(modalRef => {
            modalRef.instance.element = JSON.parse(JSON.stringify(element));
            modalRef.instance.grow = grow;
            modalRef.instance.response.subscribe(res => {
                subject.next(res);
                if (!!res) {
                    subject.complete();
                }
            });
        });

        return subject.asObservable();
    }

    /**
     * Converts a JSON representation of a node into an HTML string.
     * @param {JSONNodeI} node - The JSON representation of the node including tag name, attributes, content, and children.
     * @param {string} [prefix=''] - The optional prefix to be added before the tag name, commonly used for specific tag naming conventions.
     * @return {string} The generated HTML string based on the provided JSON node.
     */
    private json2xml(node: JSONNodeI, prefix: string = ''): string {

        let isGroup = false;

        if (node.attributes) {
            isGroup = node.attributes['is-group'];
            // Remove unwanted attributes
            delete node.attributes['editor-type'];
            delete node.attributes['is-group'];
            delete node.attributes['border_border_values'];
            delete node.attributes['inner-border_border_values'];
        }

        switch (node.tagName) {
            case 'rss':
                this.prepareRSSTag(node);
                break;
            case 'button':
                this.prepareButtonTag(node);
                break;
            case 'heading':
                node.tagName = 'text';
                break;
            case 'text':
                if (!node.attributes['font-family']) {
                    node.attributes['font-family'] = 'inherit';
                }
                break;
            case 'image-url':
                node.tagName = 'image';
                break;
        }

        const attributesString = this.lineAttributes(node.attributes);

        const innerContent = this.generateInnerContent(node, isGroup)

        return `<${prefix}${node.tagName}${attributesString}>${innerContent}</${prefix}${node.tagName}>`;
    }

    /**
     * Generates the inner content for a given JSON node based on its properties.
     *
     * @param {JSONNodeI} node - The JSON node object containing content, children, and other properties.
     * @param {boolean} isGroup - Indicates if the content belongs to a group.
     * @return {string} Returns the generated inner content as a string.
     */
    private generateInnerContent(node: JSONNodeI, isGroup: boolean): string {
        let innerContent = '';

        if (node.content) {
            innerContent = node.tagName !== 'raw'
                ? node.content
                : `<!-- htmlmin:ignore --><div style="font-size: initial;">${node.content.replace(/[\r\n]/g, '')}</div><!-- htmlmin:ignore -->`;
        } else if (node.children) {
            innerContent = node.children.map(child => this.json2xml(child, 'mj-')).join('');
        }

        // Handle section group
        if (node.tagName === 'section' && isGroup) {
            innerContent = `<mj-group>${innerContent}</mj-group>`;
        }

        return innerContent;
    }

    /**
     * Modifies the 'href' attribute of the provided JSONNodeI object to include a tracking identifier if a tracking link is present.
     * @param {JSONNodeI} node - The JSON node object containing attributes and tracking information.
     * @return {void} Does not return any value.
     */
    private prepareButtonTag(node: JSONNodeI): void {
        if (!node.trackingLink) return;
        node.attributes['href'] += `#trackable-by-${node.trackByMethod}::${node.trackingLink}`;
    }

    /**
     * Converts XML content into HTML by processing it with MJML parsing and replacing tracking link attributes.
     * @return {string} The resulting HTML string after conversion and processing.
     */
    private generateHtml(): string {

        const xml = this.json2xml(
            JSON.parse(JSON.stringify(this.page))
        );

        const htmlRes = mjml2html(xml);

        if (htmlRes.errors.length > 0) {
            this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
            console.error('mjml', htmlRes.errors);
            return undefined;
        }

        return this.replaceTrackingLinksAttributes(
            htmlRes.html
        );
    }

    /**
     * Replaces specific tracking link patterns in the provided HTML string with data attributes.
     *
     * @param {string} html - The HTML string containing tracking link patterns to be replaced.
     * @return {string} The modified HTML string with replaced tracking link attributes.
     */
    private replaceTrackingLinksAttributes(html: string): string {

        if (!html) return undefined;

        // Replace pattern: #trackable-by-id::<UUID>"
        html = html.replace(/#trackable-by-id::(.{36})"/gi, '" data-trackinglink="$1"');

        // Replace pattern: #trackable-by-url::"
        html = html.replace('#trackable-by-url::"', '" data-trackinglink=""');

        return html;
    }

    /**
     * Prepares and modifies an RSS tag structure based on the given JSON node.
     * @param {JSONNodeI} node - The JSON node object to be processed and prepared as an RSS tag.
     */
    private prepareRSSTag(node: JSONNodeI) {

        node.tagName = 'section';

        if (node.showDate === '0') {
            this.removeDateItem(node.children);
        }

        if (node.count && node.count > 1 && node.children?.length) {
            for (let i = 1; i < node.count; i++) {
                node.children.push(node.children[0]);
            }
        }

        if (node.href && node.count) {
            node.children?.push(this.generateRSSMetadataElement(node.href, node.count));
        }

        node.content = undefined;
    }

    /**
     * Removes items with a CSS class of 'rss-date' from the child elements of the provided nodes.
     * This method processes the first row of children from the provided array, identifying specific columns
     * and modifying their children based on a filter condition.
     *
     * @param {JSONNodeI[] | undefined} children
     */
    private removeDateItem(children: JSONNodeI[] | undefined): void {

        const firstRow = children[0]?.children?.[0]?.children;

        firstRow.forEach((col, colIdx) => {
            if (col.attributes?.['css-class'] !== 'rss-item-content-column') return;

            firstRow[colIdx].children = (col.children ?? []).filter(
                item => item.attributes?.['css-class'] !== 'rss-date'
            );
        });
    }

    /**
     * Generates a JSONNodeI object representing an RSS metadata element.
     * @param {string} href The URL to be used in the RSS metadata.
     * @param {number} count The count or string to be included in the RSS metadata.
     * @return {JSONNodeI} The generated metadata element as a JSONNodeI object.
     */
    private generateRSSMetadataElement(href: string, count: number): JSONNodeI {
        return {
            tagName: 'column',
            children: [
                {
                    tagName: 'raw',
                    content: `<div data-spice-rss="${href}" data-spice-rss-count="${count}"></div>`
                }
            ]
        };
    }

    /**
     * Constructs a string representation of attributes based on the provided key-value pairs.
     * @param {Record<string, any>} attributes - An object containing key-value pairs where the key is the attribute name and the value is the attribute value.
     * @return {string} A formatted string of attributes that can be used in an HTML element. Each key-value pair is formatted as `key="value"` and separated by a space.
     */
    private lineAttributes(attributes: Record<string, any>): string {

        if (!attributes) return '';

        let res = '';

        Object.entries(attributes).forEach(([key, value]) => {
            if (!value) return;
            res += `${key}="${value}" `;
        });

        return ` ${res.trim()}`;
    }
}

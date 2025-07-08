import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    SimpleChanges
} from '@angular/core';
import {libloader} from "../../../services/libloader.service";
import {asapScheduler} from "rxjs";
import {backend} from "../../../services/backend.service";
import {view} from "../../../services/view.service";
import {TxControlParagraphStyleI} from "../interfaces/documenteditor.interfaces";

declare var TXTextControl: any;
declare var _;

@Component({
    selector: 'document-editor',
    templateUrl: '../templates/documenteditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DocumentEditor implements AfterViewInit, OnDestroy, OnChanges {
    /**
     * holds the editor container
     */
    public editorId: string;
    /**
     * holds the loaded document file
     */
    @Input() public file: {
        content: string, // base64
        mimeType: string,
    };
    /**
     * api token
     */
    public settings: {token: string, serverUrl: string, scriptUrl: string};
    /**
     * is loading flag
     */
    public isLoading: boolean = false;
    /**
     * doc type mapping
     * @private
     */
    private typeMapping = {
        pdf: {
            mimeType: 'application/pdf',
            txControlType: 'AdobePDF'
        },
        docx: {
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            txControlType: 'WordprocessingML'
        },
        plain: {
            mimeType: 'text/plain',
            txControlType: 'PlainText'
        }
    };

    constructor(private zone: NgZone,
                private backend: backend,
                private cdRef: ChangeDetectorRef,
                private view: view,
                private libLoader: libloader) {
        this.editorId = _.uniqueId('TxEditorContainer_');
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (window['TXTextControl'] && changes.readOnly) {
            this.refreshLayout();
        }

        if (window['TXTextControl'] && changes.file && this.file) {
            this.loadContent();
        }
    }

    /**
     * initialize the editor
     */
    public ngAfterViewInit() {

        this.setIsLoading(true);

        this.backend.getRequest('common/TXControl/settings').subscribe({
            next: config => {

                this.settings = config;
                this.cdRef.detectChanges();

                if (!this.settings.token) {
                    this.setIsLoading(false);
                    return;
                }

                this.zone.runOutsideAngular(() => {
                    this.libLoader.loadFromSource([this.settings.scriptUrl]).subscribe({
                        next: () => {
                            this.libLoader.loadedLibs.push({name: 'tx-editor', status: 'loaded'});
                            this.initializeEditor();
                        },
                        error: () => {
                            this.setIsLoading(false);
                        }
                    });
                });
            },
            error: () => {
                this.setIsLoading(false);
            }
        });
    }

    /**
     * refresh layout
     */
    public refreshLayout() {
        asapScheduler.schedule(() => TXTextControl.refreshLayout(), 100);
    }

    /**
     * get document content
     */
    public getContent(type: 'pdf' | 'docx' | 'plain'): Promise<{ content: string, mimeType: string }> {

        return new Promise((res, rej) => {

            const exportType = this.typeMapping[type];

            this.zone.runOutsideAngular(() => {
                TXTextControl.saveDocument(TXTextControl.StreamType[exportType.txControlType], (e) => {
                    if (e) {
                        res({
                            content: e.data,
                            mimeType: this.typeMapping[type].mimeType
                        });
                    } else {
                        rej();
                    }
                });
            });
        });

    }

    /**
     * unsubscribe
     */
    public ngOnDestroy() {
        if (TXTextControl.removeFromDom) {
            TXTextControl.removeFromDom();
        }
        this.libLoader.removeLibFromHead(this.settings.scriptUrl);
    }

    /**
     * load editor library
     * @private
     */
    private initializeEditor() {
        TXTextControl.addEventListener('textControlLoaded', () => {
            this.setIsLoading(false);
            this.generateEssentialStylesOptions();
            this.loadContent();
        });
        TXTextControl.init({
            containerID: this.editorId,
            serviceURL: this.settings.serverUrl,
            reconnectTimeout: 0,
            authSettings: {
                accessToken: this.settings.token
            }
        });
    }

    /**
     * generate the essential predefined styles like heading 1,2,3 and title
     * @private
     */
    private generateEssentialStylesOptions() {

        const headings: TxControlParagraphStyleI[] = [
            {
                name: 'Title',
                attributes: {
                    setBold: true,
                    setFontSize: 560,
                },
            },
            {
                name: 'Subtitle',
                attributes: {
                    setFontSize: 280,
                    setForeColor: '#808080',
                },
            },
            {
                name: 'h1',
                attributes: {
                    setBold: true,
                    setFontSize: 400,
                },
            },
            {
                name: 'h2',
                attributes: {
                    setBold: true,
                    setFontSize: 320,
                },
            },
            {
                name: 'h3',
                attributes: {
                    setBold: true,
                    setFontSize: 280,
                },
            },
            {
                name: 'h4',
                attributes: {
                    setBold: true,
                    setFontSize: 240,
                    setItalic: true,
                },
            },
            {
                name: 'h5',
                attributes: {
                    setBold: true,
                    setFontSize: 240,
                },
            },
            {
                name: 'h6',
                attributes: {
                    setBold: true,
                    setFontSize: 240,
                    setItalic: true,
                    setForeColor: '#808080'
                },
            }
        ];

        headings.forEach(headingStyle => {
            TXTextControl.paragraphStyles.add(headingStyle.name, styleInstance => {
                Object.keys(headingStyle.attributes).forEach(fn => {
                    styleInstance[fn](headingStyle.attributes[fn]);
                });
            });
        });

    }

    /**
     * load document content base64
     */
    private loadContent() {

        if (!this.file) return;

        const type = Object.keys(this.typeMapping).find(type => this.typeMapping[type].mimeType === this.file.mimeType);

        if (!type) {
            return console.error(`Unknown MIME type ${this.file.mimeType}`);
        }

        TXTextControl.loadDocument(TXTextControl.StreamType[this.typeMapping[type].txControlType], this.file.content);
    }

    /**
     * set is loading value
     * @param value
     * @private
     */
    private setIsLoading(value: boolean) {
        this.isLoading = value;
        this.cdRef.detectChanges();
    }

    /**
     * set edit mode
     */
    public setEditMode() {
        this.view.setEditMode();
        this.cdRef.detectChanges();
    }
}
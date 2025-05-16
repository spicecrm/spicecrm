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

declare var TXTextControl: any;
declare var _;

@Component({
    selector: 'document-editor',
    templateUrl: '../templates/documenteditor.html',
    changeDetection: ChangeDetectionStrategy.OnPush
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
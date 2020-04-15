import {isPlatformServer} from '@angular/common';

import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    PLATFORM_ID,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import {libloader} from "../../../services/libloader.service";

/** @ignore */
declare var Quill: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'quill-view',
    templateUrl: './src/include/quilleditor/templates/quillviewcontainer.html'
})
export class QuillViewContainer implements AfterViewInit, OnChanges {

    @ViewChild('editorContainer', {read: ViewContainerRef, static: false}) private editorContainer: ViewContainerRef;
    private quillEditor: any;
    @Input() protected readonly content: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private libLoader: libloader,
        private zone: NgZone
    ) {
    }

    /**
     * set the editor content
     */
    public ngOnChanges() {
        this.setEditorContent();
    }

    /**
     * call to render quill editor in view mode
     * set the editor content
     */
    public ngAfterViewInit() {
        if (isPlatformServer(this.platformId)) return;
        this.renderQuillEditor();
    }

    /**
     * render the quill editor with the defined options and toolbar and pass the content
     */
    private renderQuillEditor() {
        this.libLoader.loadLib('QuillEditor').subscribe(() => {
            this.zone.runOutsideAngular(() => {
                this.quillEditor = new Quill(this.editorContainer.element.nativeElement, {
                    modules: {toolbar: false},
                    readOnly: true,
                    strict: true,
                    theme: 'snow'
                });
                this.renderer.setStyle(this.editorContainer.element.nativeElement, 'border', '0');
                this.setEditorContent();
            });
        });
    }

    /**
     * set the editor content
     */
    private setEditorContent(): any {

        if (!this.quillEditor || !this.content) return;

        const value = this.quillEditor.clipboard.convert(this.content);
        this.quillEditor.setContents(value);
    }
}

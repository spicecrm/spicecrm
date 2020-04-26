/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-text',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrenderertext.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererText implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() protected text: { type: 'text', style, content };
    /**
     * hold the sanitized content html
     */
    private sanitizedContent: SafeHtml = '';
    /**
     * emit when delete button clicked
     */
    @Output() private delete$: EventEmitter<void> = new EventEmitter();

    constructor(private domSanitizer: DomSanitizer,
                private modal: modal,
                private injector: Injector,
                private cdRef: ChangeDetectorRef,
                private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to sanitize the html content
     */
    public ngOnInit() {
        this.sanitizeContent();
    }

    /**
     * sanitize the html content
     */
    private sanitizeContent() {
        this.sanitizedContent = this.domSanitizer.bypassSecurityTrustHtml(this.text.content);
    }

    /**
     * set the hovered element level
     * @param value
     */
    private setIsMouseIn(value) {
        this.spicePageBuilderService.isMouseIn = value ? 'content' : 'section';
    }

    /**
     * set the current editing element
     */
    private edit() {
        this.modal.openModal('SpicePageBuilderPanelEditor', true, this.injector).subscribe(modalRef => {
            modalRef.instance.element = this.text;
            modalRef.instance.response.subscribe(res => {
                if (!!res) {
                    this.text = JSON.parse(JSON.stringify(this.text));
                    this.sanitizeContent();
                    this.cdRef.detectChanges();
                }
            });
        });
    }
}

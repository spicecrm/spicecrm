/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injector,
    Input,
    Output
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-image',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererImage {
    /**
     * containers to be rendered
     */
    @Input() protected image: { type: 'image', style, src };
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
            modalRef.instance.element = this.image;
            modalRef.instance.response.subscribe(res => {
                if (!!res) {
                    this.image = JSON.parse(JSON.stringify(this.image));
                    this.cdRef.detectChanges();
                }
            });
        });
    }
}

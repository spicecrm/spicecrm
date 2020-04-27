/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-renderer-element',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderrendererelement.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRendererElement {
    /**
     * containers to be rendered
     */
    @Input() public element: { type, style, content?, src?, text? };
    /**
     * emit when delete button clicked
     */
    @Output() public delete$: EventEmitter<void> = new EventEmitter();

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
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
            modalRef.instance.element = JSON.parse(JSON.stringify(this.element));
            modalRef.instance.response.subscribe(res => {
                if (!!res) {
                    this.handleEditResponse(res);
                }
            });
        });
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.style = res.style;
        this.cdRef.detectChanges();
    }
}

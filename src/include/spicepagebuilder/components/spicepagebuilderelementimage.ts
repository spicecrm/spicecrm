/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, ImageI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-image',
    templateUrl: '../templates/spicepagebuilderelementimage.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementImage extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public declare element: ImageI;

    /**
     * sanitized content... containing the image URL
     */
    public sanitizedContent: SafeResourceUrl;

    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[][] = [
        [{name: 'title', type: 'text'},
        {name: 'href', type: 'text'},
        {name: 'alt', type: 'text'},
        {name: 'fluid-on-mobile', type: 'text'},
        {name: 'rel', type: 'text'},
        {name: 'srcset', type: 'text'},
        {name: 'target', type: 'text'},
        {name: 'usemap', type: 'text'},
        {name: 'border', type: 'text'},
        {name: 'border-radius', type: 'width'},
        {name: 'align', type: 'text'},
        {name: 'height', type: 'textSuffix'},
        {name: 'padding', type: 'sides'},
        {name: 'width', type: 'textSuffix'},
        {name: 'container-background-color', type: 'color'},
        {name: 'css-class', type: 'text'}]
    ];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    /**
     * open media file picker
     */
    public openMediaFilePicker() {
        this.spicePageBuilderService.openMediaFilePicker().subscribe(src => {
            if (!!src) {
                this.element.attributes.src = src;
                // this.element.attributes.inputUrl = '';
            }
        });
    }

    // public ngOnInit() {
    //     super.ngOnInit();
    //     if (!this.element.attributes.imageSource) {
    //         this.element.attributes.imageSource = 'upload';
    //     }
    // }
    //
    // public sanitizeContent() {
    //     this.sanitizedContent = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, this.domSanitizer.bypassSecurityTrustResourceUrl(this.element.attributes.inputUrl));
    //     this.element.attributes.src = this.sanitizedContent;
    // }

    /**
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'container-background-color','border', 'border-radius', 'height', 'padding', 'width'
        ]);

        switch(this.element.attributes.align){
            case 'center':
                this.style.margin = '0 auto';
                break;
            case 'right':
                this.style.float = 'right';
                break;
        }
    }

}

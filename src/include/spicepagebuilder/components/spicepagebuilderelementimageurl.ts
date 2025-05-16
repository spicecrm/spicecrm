/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectorRef, Component, Injector, Input, OnInit, SecurityContext} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {ImageUrlI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElementImage} from "./spicepagebuilderelementimage";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-image-url',
    templateUrl: '../templates/spicepagebuilderelementimageurl.html'
})
export class SpicePageBuilderElementImageUrl extends SpicePageBuilderElementImage implements OnInit {
    /**
     * containers to be rendered
     */
    @Input() public element: ImageUrlI;

    public _imageURL: string;

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public sanitizer: DomSanitizer,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    get imageURL(): string {
        return this._imageURL;
    }

    set imageURL(value: string) {
        if (URL.canParse(value)) {
            this._imageURL = value;
            this.element.attributes.src = this._imageURL;
        }
    }

    public ngOnInit() {
        super.ngOnInit();
        this._imageURL = this.element.attributes.src;
    }

    public sanitize() {
        this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.domSanitizer.bypassSecurityTrustResourceUrl(this.element.attributes.src))
    }

}
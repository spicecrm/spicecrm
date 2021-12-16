/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {BodyI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders the html page design
 */
@Component({
    selector: 'spice-page-builder-renderer',
    templateUrl: '../templates/spicepagebuilderrenderer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderRenderer implements OnInit {
    /**
     * body element to be rendered in the view
     */
    public body: BodyI;

    constructor(public spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * set the body element
     */
    public ngOnInit() {
        this.setBodyElement();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    public trackByFn(index, item) {
        return index;
    }

    /**
     * set body element
     */
    public setBodyElement() {
        if (!this.spicePageBuilderService.page || !this.spicePageBuilderService.page.children) return;
        this.body = this.spicePageBuilderService.page.children[0];
    }
}

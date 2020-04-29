/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {BodyI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders the html page design
 */
@Component({
    selector: 'spice-page-builder-element-body',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderelementbody.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementBody implements OnInit {
    /**
     * body element to be rendered in the view
     */
    @Input() protected body: BodyI;
    /**
     * hold the body style object
     */
    private style = {};

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {
        this.generateStyle();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    protected trackByFn(index, item) {
        return index;
    }

    /**
     * generate body style object
     */
    private generateStyle() {
        this.style = {
            'background-color': this.body.attributes['background-color'],
            'width': this.body.attributes.width
        };
    }
}

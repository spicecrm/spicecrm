/**
 * @module ModuleSpicePageBuilder
 */
import {Component} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";

/** @ignore */
declare var _;

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel-editor',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpaneleditor.html'
})
export class SpicePageBuilderPanelEditor {
    /**
     * hold the element style array
     */
    protected styleArray: any[] = [];

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate sections
     */
    public ngOnInit() {
        this.setElementStyleArray();
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

    private setElementStyleArray() {
        for (let attribute in this.spicePageBuilderService.editingElement.style) {
            if (!this.spicePageBuilderService.editingElement.style.hasOwnProperty(attribute)) continue;
            this.styleArray.push({
                label: attribute,
                value: this.spicePageBuilderService.editingElement.style[attribute]
            });
        }
    }
}

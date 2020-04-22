/**
 * @module ModuleSpicePageBuilder
 */
import {Component} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDragExit} from "@angular/cdk/drag-drop";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpanel.html'
})
export class SpicePageBuilderPanel {

    protected sections: Array<{ type, columns, style }> = [];
    protected contentElements: any[] = [
        {
            type: 'text',
            style: {},
            content: 'Write Text Here'
        },
        {
            type: 'image',
            style: {},
            src: ''
        },

    ];

    constructor(private spicePageBuilderService: SpicePageBuilderService) {
    }

    /**
     * call to generate sections
     */
    public ngOnInit() {
        this.generateSections();
    }

    /**
     * generate sections
     */
    protected generateSections() {

        let counterSection = 1;

        while (counterSection <= 4) {
            let counterColumn = 1;
            let columns = [];

            while (counterColumn <= counterSection) {
                columns.push({type: 'column', style: {}, elements: []});
                counterColumn++;
            }
            this.sections.push({
                type: 'section',
                style:
                    {
                        'background-color': '#C1DFFF',
                        'min-height': '150px',
                        'margin': '.25rem'
                    },
                columns
            });
            counterSection++;
        }
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
     * Predicate function that doesn't allow items to be dropped into a list.
     */
    protected noReturnPredicate() {
        return false;
    }

    /**
     * emit drag exited to parent
     * @param itemType
     * @param event
     */
    private onDragExit(itemType: 'section' | 'content', event: CdkDragExit) {
        event.container.addItem(event.item);
    }
}

/**
 * @module ModuleSpicePageBuilder
 */
import {Component} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDragEnter, CdkDragExit} from "@angular/cdk/drag-drop";

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
            style: {
                'padding': '4px',
                'height': '200px',
                'width': '100%',
                'background-color': '#e7e7e7',
            },
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
                columns.push({type: 'column', style: {padding: '8px'}, elements: []});
                counterColumn++;
            }
            this.sections.push({
                type: 'section',
                style:
                    {
                        'background-color': '#C1DFFF',
                        'margin-bottom': '.5rem'
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
     * @param event
     */
    private onDragExit(event: CdkDragExit) {
        const placeholderNode: any = event.item.getPlaceholderElement().cloneNode(true);
        this.spicePageBuilderService.dragPlaceholderNode = placeholderNode;
        event.container.element.nativeElement.insertBefore(placeholderNode, event.item.getPlaceholderElement());
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    private onDragEnter(event: CdkDragEnter) {
        if (this.spicePageBuilderService.dragPlaceholderNode && event.container.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
            event.container.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
            this.spicePageBuilderService.dragPlaceholderNode = undefined;
        }
    }
}

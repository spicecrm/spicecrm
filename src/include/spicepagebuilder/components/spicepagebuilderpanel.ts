/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDragEnter, CdkDragExit} from "@angular/cdk/drag-drop";
import {ColumnI, SectionI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel',
    templateUrl: './src/include/spicepagebuilder/templates/spicepagebuilderpanel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanel {
    /**
     * available sections
     */
    protected sections: SectionI[] = [];

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
            let columns: ColumnI[] = [];

            while (counterColumn <= counterSection) {
                columns.push(
                    JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultColumn))
                );
                counterColumn++;
            }
            const section: SectionI = JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultSection));
            section.children = columns;
            this.sections.push(section);
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

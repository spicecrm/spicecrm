/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {CdkDragEnter, CdkDragExit} from "@angular/cdk/drag-drop";
import {ColumnI, CustomElement, SectionI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render a set of tools and configurations to be used for building pages
 */
@Component({
    selector: 'spice-page-builder-panel',
    templateUrl: '../templates/spicepagebuilderpanel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanel {
    /**
     * reference of the parent to allow destroy
     * @private
     */
    @Input() public self: any;
    /**
     * user predefined sections
     */
    @Input() public customSections: CustomElement[] = [];
    /**
     * user predefined items
     */
    @Input() public customItems: CustomElement[] = [];
    /**
     * available sections
     */
    public sections: SectionI[] = [];

    constructor(public spicePageBuilderService: SpicePageBuilderService, private cdRef: ChangeDetectorRef) {
    }

    /**
     * call to generate sections
     */
    public ngOnInit() {
        this.spicePageBuilderService.loadCustomElements();
        this.generateSections();
    }

    public ngAfterViewInit(){
        this.cdRef.detectChanges();
    }

    /**
     * generate sections
     */
    public generateSections() {

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
    public trackByFn(index, item) {
        return index;
    }

    /**
     * Predicate function that doesn't allow items to be dropped into a list.
     */
    public noReturnPredicate() {
        return false;
    }

    /**
     * emit drag exited to parent
     * @param event
     */
    public onDragExit(event: CdkDragExit) {
        const placeholderNode: any = event.item.getPlaceholderElement().cloneNode(true);
        this.spicePageBuilderService.dragPlaceholderNode = placeholderNode;
        event.container.element.nativeElement.insertBefore(placeholderNode, event.item.getPlaceholderElement());
    }

    /**
     * remove placeholder element if exists
     * @param event
     */
    public onDragEnter(event: CdkDragEnter) {
        if (this.spicePageBuilderService.dragPlaceholderNode && event.container.element.nativeElement.contains(this.spicePageBuilderService.dragPlaceholderNode)) {
            event.container.element.nativeElement.removeChild(this.spicePageBuilderService.dragPlaceholderNode);
            this.spicePageBuilderService.dragPlaceholderNode = undefined;
        }
    }

    /**
     * emit the page data by the service
     * @private
     */
    public save() {
        this.spicePageBuilderService.emitData();
    }

    /**
     * emit the page data by the service
     * @private
     */
    public cancel() {
        this.spicePageBuilderService.emitData(true);
        this.self.destroy();
    }
}

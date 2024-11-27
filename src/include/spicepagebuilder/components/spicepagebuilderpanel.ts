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
    selector: ' spice-page-builder-panel',
    templateUrl: '../templates/spicepagebuilderpanel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderPanel {
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

    /**
     * contains the section with the ability to input custom number of columns
     */
    public inputColumnsSection: SectionI[] = []

    /**
     * the number of columns to be inserted in the section
     */
    public _columnsCounter: number = 1;

    /**
     * the number of maximum columns allowed for the custom section
     */
    public maxNumberOfColumns: number = 12;

    /**
     * validity of the input for the number of columns
     */
    public columnsCounterInputValid: boolean = true;

    constructor(public spicePageBuilderService: SpicePageBuilderService, private cdRef: ChangeDetectorRef) {
    }

    /**
     * call to generate sections
     */
    public ngOnInit() {
        this.spicePageBuilderService.loadCustomElements();
        this.generateInputColumns();
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
            let columnsWithWidth = [...columns];
            let width = 100 / columns.length
            columnsWithWidth.forEach(col=>col.attributes.width = width.toString() + '%')
            section.children = columnsWithWidth;

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
     * generates a section with ability to create up to 12 columns
     * @param columnsToAdd number of columns to be added
     */
    public generateInputColumns(columnsToAdd: number = 1): void {

        const section: SectionI = JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultSection));
        let columns: ColumnI[] = [];

        for (let i = 0; i < columnsToAdd; i++) {
            columns.push(JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultColumn)));
        }

        let columnsWithWidth = [...columns];
        let width = 100 / columns.length
        columnsWithWidth.forEach(col => col.attributes.width = `${(Math.round(width * 100) / 100).toFixed(2)}%`);
        section.children = columnsWithWidth;

        this.inputColumnsSection.push(section);
    }

    /**
     * add or remove the section columns based on the input
     */
    public addColumns(): void {
        // remove the first generated section in order to push new one
        this.inputColumnsSection.pop();

        this.generateInputColumns(this.columnsCounter);
    }

    get columnsCounter() {
        return this._columnsCounter;
    }

    set columnsCounter(value) {
        this._columnsCounter = value;
    }

    /**
     * Validate the column counter input: ensure the value is a number and does not exceed the maximum number of columns.
     * @param newValue
     */
    public validateColumnsCounter(newValue) {
        this.columnsCounterInputValid = newValue > 0 && newValue <= this.maxNumberOfColumns && /^\d*$/.test(newValue.toString());
    }

    /**
     * generate section style based on the columns input validity
     */
    public customSectionStyle() {
        if (this.columnsCounterInputValid) {
            return {
                border: '2px solid #ca1b21',
                cursor: 'move',
            }
        } else {
            return {
                border: '2px solid #444444',
                cursor: 'not-allowed',
            }
        }
    }

    public columnsCounterInputStyle() {
        return {
            'min-height': '1rem',
            'line-height': '1rem',
            'padding-inline': '.5rem',
            width: '2rem'
        }
    }

}
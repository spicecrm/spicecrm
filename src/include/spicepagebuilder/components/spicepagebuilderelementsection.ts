/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {AttributeObjectI, SectionI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-section',
    templateUrl: '../templates/spicepagebuilderelementsection.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementSection implements OnInit {
    /**
     * hold the edit mode boolean
     */
    @Input() public isEditMode: boolean = false;
    /**
     * containers to be rendered
     */
    @Input() public readonly section: SectionI;
    /**
     * emit when delete button clicked
     */
    @Output() public delete$: EventEmitter<void> = new EventEmitter();
    /**
     * hold the style object for the element
     */
    public style = {};
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'background-color', type: 'color'},
        {name: 'color', type: 'color'},
        {name: 'padding', type: 'sides'},
        {name: 'css-class', type: 'text'},
        {name: 'border', type: 'text'},
        {name: 'border-top', type: 'text'},
        {name: 'border-right', type: 'text'},
        {name: 'border-bottom', type: 'text'},
        {name: 'border-left', type: 'text'},
        {name: 'background-position', type: 'text'},
        {name: 'background-repeat', type: 'text'},
        {name: 'background-size', type: 'text'},
        {name: 'background-url', type: 'text'},
    ];

    constructor(public spicePageBuilderService: SpicePageBuilderService,
                private cdRef: ChangeDetectorRef) {
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
    public trackByFn(index, item) {
        return index;
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        this.style = {
            'background-color': this.section.attributes['background-color'],
            'color': this.section.attributes.color,
            'padding': this.section.attributes.padding,
            'css-class': this.section.attributes['css-class'],
            'border': this.section.attributes.border,
            'border-top': this.section.attributes['border-top'],
            'border-right': this.section.attributes['border-right'],
            'border-bottom': this.section.attributes['border-bottom'],
            'border-left': this.section.attributes['border-left'],
            'background-position': this.section.attributes['background-position'],
            'background-repeat': this.section.attributes['background-repeat'],
            'background-size': this.section.attributes['background-size'],
            'background-url': this.section.attributes['background-url'],
        };
    }

    /**
     * set the hovered element level
     * @param value
     */
    public setIsMouseIn(value) {
        this.spicePageBuilderService.isMouseIn = value ? 'section' : undefined;
    }

    /**
     * save element as custom
     */
    public saveAsCustom() {
        this.spicePageBuilderService.saveCustomElement(this.section, 'section');
    }

    /**
     * open edit modal
     */
    public edit() {

        this.spicePageBuilderService.openEditModal(this.section).subscribe({
            next: res => {
                if (!!res) {
                    this.handleEditResponse(res);
                }
            }
        });
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.section.attributes = res.attributes;
        this.generateStyle();
        this.spicePageBuilderService.emitData();
        this.cdRef.detectChanges();
    }
}

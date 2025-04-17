/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
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
    public readonly mainAttributesList: AttributeObjectI[][] = [
        [
            {name: 'background-color', type: 'color', class: 'slds-size--1-of-2'},
            {name: 'direction', type: 'direction', class: 'slds-size--1-of-2'},
        ], [
            {name: 'padding', type: 'padding', class: 'slds-size--1-of-1'}
        ]
    ];
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[][] = [
        [
            {name: 'color', type: 'color',},
            {name: 'css-class', type: 'text'},
        ], [
            {name: 'border', type: 'borders', class: 'slds-size--1-of-1'}
        ], [
            {name: 'background-position', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'background-repeat', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'background-size', type: 'text', class: 'slds-size--1-of-4'},
            {name: 'background-url', type: 'text', class: 'slds-size--1-of-4'}
        ]
    ];

    /**
     * list of the editable attributes
     */
    public readonly columnAttributesList: AttributeObjectI[][] = [
        [
            {name: 'width', type: 'width', class: 'slds-size--1-of-2'},
            {name: 'background-color', type: 'color', class: 'slds-size--1-of-2'}
        ], [
            {name: 'padding', type: 'padding', class: 'slds-size--1-of-1'}
        ], [
            {name: 'border', type: 'borders', class: 'slds-size--1-of-1'}
        ],[
            {name: 'inner-border', type: 'borders', class: 'slds-size--1-of-1'}
        ], [
            {name: 'css-class', type: 'text', class: 'slds-size--1-of-1'}
        ]
    ];


    constructor(
        public elementRef: ElementRef,
        public spicePageBuilderService: SpicePageBuilderService,
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
            'direction': this.section.attributes['direction']
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
        this.section.children = res.children;
        this.section.children.forEach((input, index) => {
            input.attributes = res.children[index].attributes
        });
        this.generateStyle();
        this.spicePageBuilderService.emitData();
        this.cdRef.detectChanges();
    }

    /**
     * add new column to the section element
     * @returns void
     */
    public addColumn(): void {
        let newSection = JSON.parse(JSON.stringify(this.spicePageBuilderService.panelDefaultColumn))
        const childrenCount = this.section.children.length;
        const childWidth = `${100 / childrenCount}%`;
        newSection.attributes.width = childWidth;
        this.section.children.push(newSection);

        this.recalculateColumnSizes();
        this.cdRef.detectChanges();
    }
    /**
     * add new column to the section element
     * @returns void
     */
    public deleteColumn(index): void {
        this.section.children.splice(index, 1);
        this.recalculateColumnSizes();
        this.cdRef.detectChanges();
    }

    private  recalculateColumnSizes(){
        let totalWidth = 0;
        this.section.children.forEach(c => {
            totalWidth += parseInt(c.attributes.width, 10);
        })
        this.section.children.forEach(c => {
            let cWidth = parseInt(c.attributes.width, 10);
            let nWidth = Math.round(100/totalWidth * cWidth);
            c.attributes.width = c.attributes.width.replace(cWidth.toString(), nWidth.toString());

        })
    }
}

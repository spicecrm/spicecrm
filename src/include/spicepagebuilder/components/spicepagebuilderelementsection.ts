/**
 * @module ModuleSpicePageBuilder
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter, Injector,
    Input,
    OnInit, Optional,
    Output, SkipSelf
} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {
    AttributeObjectI, MediaArticleI,
    SectionI,
} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderMediaArticleService} from "../services/spicepagebuildermediaarticle.service";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-section',
    templateUrl: '../templates/spicepagebuilderelementsection.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
            {name: 'direction', type: 'direction', class: 'slds-size--1-of-4'},
            {name: 'is-group', type: 'bool', class: 'slds-size--1-of-4'},
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

    constructor(
        public elementRef: ElementRef,
        public spicePageBuilderService: SpicePageBuilderService,
        public _articleService: SpicePageBuilderMediaArticleService,
        @SkipSelf() @Optional() public _articleServiceParent: SpicePageBuilderMediaArticleService,
        private injector: Injector,
        private cdRef: ChangeDetectorRef) {
    }

    get articleService(): SpicePageBuilderMediaArticleService {
        return this.isEditMode ? this._articleServiceParent : this._articleService;
    }

    /**
     * call to generate body style from attributes
     */
    public ngOnInit() {

        this.handleMediaArticleAttribute();

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
     * open the edit modal
     * pass the custom view mode injector to the edit modal to pass the provided media article service instance.
     */
    public edit() {

        this.spicePageBuilderService.openEditModal(this.section, true, this.injector).subscribe({
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
        this.section.children.forEach((column, index) => {
            column.attributes = res.children[index].attributes;
            this.spicePageBuilderService.handleMediaArticleAttribute(column, 'media-article');
            this.articleService.fillInArticleParts(this.section.attributes['media-article'], column);
        });

        this.generateStyle();

        this.spicePageBuilderService.handleMediaArticleAttribute(this.section, 'media-article');
        this.articleService.fillInArticleParts(this.section.attributes['media-article'], this.section);

        this.spicePageBuilderService.emitData();
        this.cdRef.detectChanges();
    }

    /**
     * handle article change and load the media article data
     * @param id
     */
    public handleArticleChange(id: string) {
        this.articleService.loadMediaArticle(id).subscribe(() => {
            this.cdRef.detectChanges();
        });
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

    /**
     * load the media article data if in edit mode, otherwise set the id
     *
     * @private
     */
    private handleMediaArticleAttribute() {

        if (!this.section.attributes['media-article']) return;

        if (this.isEditMode) {
            this.articleService.loadMediaArticle(this.section.attributes['media-article']).subscribe(() =>
                this.cdRef.detectChanges()
            );
        }
    }

    private recalculateColumnSizes() {
        let totalWidth = 0;
        this.section.children.forEach(c => {
            totalWidth += parseInt(c.attributes.width, 10);
        })
        this.section.children.forEach(c => {
            let cWidth = parseInt(c.attributes.width, 10);
            let nWidth = Math.round(100 / totalWidth * cWidth);
            c.attributes.width = c.attributes.width.replace(cWidth.toString(), nWidth.toString());

        })
    }
}

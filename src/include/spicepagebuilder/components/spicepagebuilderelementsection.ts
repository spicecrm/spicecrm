/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {SectionI} from "../interfaces/spicepagebuilder.interfaces";

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

    constructor(public spicePageBuilderService: SpicePageBuilderService) {
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
            'border': this.section.attributes.border,
            'border-top': this.section.attributes['border-top'],
            'border-right': this.section.attributes['border-right'],
            'border-bottom': this.section.attributes['border-bottom'],
            'border-left': this.section.attributes['border-left'],
            'border-radius': this.section.attributes['border-radius'],
            'padding': this.section.attributes.padding,
            'text-align': this.section.attributes['text-align']
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
}

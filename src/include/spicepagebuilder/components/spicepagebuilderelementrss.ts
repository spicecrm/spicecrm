/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, RSSI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-rss',
    templateUrl: '../templates/spicepagebuilderelementrss.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementRSS extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public declare element: RSSI;
    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[] = [
        {name: 'align', type: 'text'},
        {name: 'width', type: 'textSuffix'},
        {name: 'border', type: 'text'},
        {name: 'border-top', type: 'text'},
        {name: 'border-right', type: 'text'},
        {name: 'border-bottom', type: 'text'},
        {name: 'border-left', type: 'text'},
        {name: 'height', type: 'textSuffix'},
        {name: 'padding', type: 'sides'},
        {name: 'line-height', type: 'textSuffix'},
        {name: 'vertical-align', type: 'text'},
        {name: 'font-size', type: 'textSuffix'},
        {name: 'font-style', type: 'text'},
        {name: 'font-weight', type: 'text'},
        {name: 'letter-spacing', type: 'textSuffix'},
        {name: 'text-decoration', type: 'text'},
        {name: 'text-transform', type: 'text'},
        {name: 'css-class', type: 'text'}
    ];
    /**
     * style attributes list for the item children
     */
    public childrenAttributesList: {[key: string]: AttributeObjectI[]} = {
        'RSS-ITEM-HEADER-PLACEHOLDER': [
            {name: 'align', type: 'text'},
            {name: 'inner-padding', type: 'sides'},
            {name: 'background-color', type: 'color'},
            {name: 'color', type: 'color'},
            {name: 'font-size', type: 'textSuffix'},
            {name: 'line-height', type: 'textSuffix'},
            {name: 'font-weight', type: 'text'},
            {name: 'padding', type: 'sides'},
            {name: 'container-background-color', type: 'color'},
        ],
        'RSS-ITEM-DATE-PLACEHOLDER': [
            {name: 'font-size', type: 'textSuffix'},
            {name: 'line-height', type: 'textSuffix'},
            {name: 'padding', type: 'sides'},
            {name: 'container-background-color', type: 'color'},
        ],
        'RSS-ITEM-DESCRIPTION-PLACEHOLDER': [
            {name: 'font-size', type: 'textSuffix'},
            {name: 'line-height', type: 'textSuffix'},
            {name: 'padding', type: 'sides'},
            {name: 'container-background-color', type: 'color'},
        ]
    }

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
    }

    set count(val: string) {
        if (+val < 1) val = '1';
        if (+val > 100) val = '100';
        this.element.count = val;
    }

    get count(): string {
        return this.element.count;
    }

    /**
     * handle edit changes
     */
    public handleEditResponse(res) {
        this.element.content = res.content;
        this.element.href = res.href;
        this.element.count = res.count;
        this.element.children = res.children;
        super.handleEditResponse(res);
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'width', 'background-color', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'height', 'padding', 'css-class'
        ]);
    }
}

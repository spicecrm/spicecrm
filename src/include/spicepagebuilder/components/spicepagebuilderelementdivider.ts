/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {modal} from "../../../services/modal.service";
import {AttributeObjectI, DividerI} from "../interfaces/spicepagebuilder.interfaces";
import {SpicePageBuilderElement} from "./spicepagebuilderelement";

/**
 * Parse and renders renderer container
 */
@Component({
    selector: 'spice-page-builder-element-divider',
    templateUrl: '../templates/spicepagebuilderelementdivider.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpicePageBuilderElementDivider extends SpicePageBuilderElement {
    /**
     * containers to be rendered
     */
    @Input() public declare element: DividerI;

    /**
     * list of the editable attributes
     */
    public readonly mainAttributesList: AttributeObjectI[][] = [
        [
            {name: 'border-color', type: 'color'},
            {name: 'border-width', type: 'textSuffix'}
        ],
        [
            {name: 'width', type: 'width'},
            {name: 'align', type: 'halign'}
        ]
    ];

    /**
     * list of the editable attributes
     */
    public readonly attributesList: AttributeObjectI[][] = [
        [
            {name: 'container-background-color', type: 'color'},
            {name: 'border-style', type: 'text'}
        ],
        [
            {name: 'padding', type: 'sides'},
            {name: 'css-class', type: 'text'}
        ]
    ];

    constructor(public domSanitizer: DomSanitizer,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
                public spicePageBuilderService: SpicePageBuilderService) {
        super(domSanitizer, modal, injector, cdRef, spicePageBuilderService);
        this.growEditorModal = false;
    }

    get displayStyle(){
        let styles = this.returnStyle(['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']);
        if(this.element.attributes['container-background-color']){
            styles['background-color'] = this.element.attributes['container-background-color'];
        }
        return styles;
    }

    /**
     * generate body style object
     */
    public generateStyle() {
        super.generateStyle([
            'border-color', 'border-style', 'border-width', 'align', 'width'
        ]);

        switch(this.element.attributes.align){
            case 'center':
                this.style.margin = '0 auto';
                break;
            case 'right':
                this.style.float = 'right';
                this.style.margin = '0px';
                break;
            case 'left':
                this.style.margin = '0px';
                break;
        }
    }
}

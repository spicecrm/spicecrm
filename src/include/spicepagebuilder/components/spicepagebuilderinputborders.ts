/**
 * @module ModuleSpicePageBuilder
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SpicePageBuilderService} from "../services/spicepagebuilder.service";
import {EditorAttributeI} from "../interfaces/spicepagebuilder.interfaces";

/**
 * render four input fields to handle editing style attributes like margin or padding
 */
@Component({
    selector: 'spice-page-builder-input-borders',
    templateUrl: '../templates/spicepagebuilderinputborders.html',

})
export class SpicePageBuilderInputBorders implements OnInit{
    /**
     * name of the style attribute
     */
    @Input() public label: string = '';

    /**
     * the attribute to be set - by default border
     * can also be e.g. inner-border
     */
    @Input() public attribute: string = 'border';

    /**
     * the attributes
     */
    @Input() public attributes: any = {};

    constructor(public cdRef: ChangeDetectorRef, public spicePageBuilderService: SpicePageBuilderService) {
    }

    get border_values(){
        return this.attributes[this.attribute + '_border_values'];
    }

    set border_values(val){
        this.attributes[this.attribute + '_border_values'] = val;

        switch (val){
            case 'none':
                this.attributes[this.attribute] = undefined;
                this.attributes[this.attribute + '-left'] = undefined;
                this.attributes[this.attribute + '-right'] = undefined;
                this.attributes[this.attribute + '-top'] = undefined;
                this.attributes[this.attribute + '-bottom'] = undefined;
                break;
            case 'uniform':
                this.attributes[this.attribute + '-left'] = undefined;
                this.attributes[this.attribute + '-right'] = undefined;
                this.attributes[this.attribute + '-top'] = undefined;
                this.attributes[this.attribute + '-bottom'] = undefined;
                break;
            case 'distinct':
                this.attributes[this.attribute] = undefined;
                break;
        }
    }

    public ngOnInit() {
        if(!this.attributes.border_values) {
            if (!!this.attributes[this.attribute]) {
                this.attributes[this.attribute + '_border_values'] = 'uniform'
            } else if(!!this.attributes[this.attribute + '-left'] || !!this.attributes[this.attribute + '-top'] || !!this.attributes[this.attribute + '-right'] || !!this.attributes[this.attribute + '-bottom']){
                this.attributes[this.attribute + '_border_values'] = 'distinct'
            } else {
                this.attributes[this.attribute + '_border_values'] = 'none';
            }
        }
    }

}

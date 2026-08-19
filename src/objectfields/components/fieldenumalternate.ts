/**
 * @module ObjectFields
 */
import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {fieldEnum} from './fieldenum';

@Component({
    selector: 'field-enum-alternate',
    templateUrl: '../templates/fieldenumalternate.html',
    standalone: false
})

export class fieldEnumAlternate extends fieldEnum {

    /**
     * injected instance of the ElementRef
     */
    public elementRef: ElementRef = inject(ElementRef);

    public ngOnInit() {
        super.ngOnInit();

        if(this.fieldconfig.fielddisplayclass){
            this.fielddisplayclass = this.fieldconfig.fielddisplayclass;
        }
    }

    public setValue(value) {
        this.value = value; // not needed anymore? :o
    }

    get width() {
        return this.elementRef.nativeElement.parentElement.getBoundingClientRect().width;
    }

    get sizeClass(){
        let matches = Math.ceil(this.width / 300);
        return matches <= 8 ? `slds-size--1-of-${matches}` : 'slds-size--1-of-8';
    }
}

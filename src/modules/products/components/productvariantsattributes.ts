import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnChanges, OnInit, EventEmitter, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

@Component({
    selector: 'product-variants-attributes',
    templateUrl: './src/modules/products/templates/productvariantsattributes.html'
})
export class ProductVariantsAttributes  {

    requiredopen: boolean = true;

    @Input() showrequired: boolean = true;
    @Input() showoptional: boolean = true;
    @Input() showreadonly: boolean = true;

    constructor(private language: language) {

    }

    togglerequired() {
        this.requiredopen = !this.requiredopen;
    }

    getRequiredStyle() {
        if (!this.requiredopen)
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            }
    }

}
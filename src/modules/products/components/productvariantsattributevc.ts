import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {view} from '../../../services/view.service';


declare var moment: any;

@Component({
    selector: 'product-variants-attribute-vc',
    templateUrl: './src/modules/products/templates/productvariantsattributevc.html'
})
export class ProductVariantsAttributeVC implements OnInit{

    @Input() attribute : any = {};
    attrbutevalueset: any = undefined;

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public view: view, public model: model) {

    }

    ngOnInit(){
        // check if we have an attribute value on the model
        if(this.model.data.productattributevalues){
            for(let id in this.model.data.productattributevalues.beans){
                if(this.model.data.productattributevalues.beans[id].productattribute_id === this.attribute.id){
                    this.attrbutevalueset = this.model.data.productattributevalues.beans[id];
                }
            }
            if(!this.attrbutevalueset){
                this.createAttributeValueSet();
            }
        } else {
            this.model.data.productattributevalues  = {
                beans: {}
            };

            this.createAttributeValueSet();

        }
    }

    createAttributeValueSet(){
        let guid = this.model.generateGuid();
        this.model.data.productattributevalues.beans[guid]={
            id: guid,
            productattribute_id: this.attribute.id,
            pratvalue: '',
            parent_id: this.model.id,
            parent_type: this.model.module
        }
        this.attrbutevalueset = this.model.data.productattributevalues.beans[guid];
    }

    get value(){
        return this.attrbutevalueset.pratvalue;
    }

    set value(value){
        this.attrbutevalueset.pratvalue = value;
    }

    get editable(){
        if(!this.view.isEditable )
            return false;
        else
            return true;
    }


    get editmode(){
        if (this.view.isEditMode())
            return true;
        else
            return false;
    }

    setEditMode() {
        this.model.startEdit();
        this.view.setEditMode();
    }

    // for handling field errors
    setFieldError(error){
        // this.model.setFieldError('attr:' + this.attribute.id, error);
    }

    getFieldError() {
        // return this.model.getFieldError('attr:' + this.attribute.id);
    }

    clearFieldError(){
        // this.model.clearFieldError('attr:' + this.attribute.id);
    }

    fieldHasError() {
        //if (this.model.validityStatus['attr:' + this.attribute.id])
        //    return true;
        //else
            return false
    }

}
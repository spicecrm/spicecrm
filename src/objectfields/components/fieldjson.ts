/**
 * @module ObjectFields
 */
import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {fieldGeneric} from "./fieldgeneric";

@Component({
    selector: 'field-json',
    templateUrl: '../templates/fieldjson.html'
})
export class fieldJson extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return JSON.stringify(JSON.parse(this.model.getField(this.fieldname)), null, '\t');
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.fieldname, val);
    }

}

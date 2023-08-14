/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    templateUrl: '../templates/fieldparentdetails.html'
})
export class fieldParentDetails extends fieldGeneric implements OnInit {
    public parentDefs: any = {};

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();
        this.getParentDefinition();
    }

    get module() {
        return this.fieldconfig.module;
    }

    get componentset() {
        return this.fieldconfig.componentset;
    }

    /**
     * Display only if model module equals config module.
     */
    get display() {
        return this.parentId && this.module == this.parentModule;
    }

    /**
     * Parent module getter.
     */
    get parentModule() {
        return this.parentDefs?.type_name ? this.model.getField(this.parentDefs.type_name) : undefined;
    }

    /**
     * Parent ID getter.
     */
    get parentId() {
        return this.parentDefs?.id_name ? this.model.getField(this.parentDefs.id_name) : undefined;
    }

    /**
     * Initializes parent object definitions.
     * @private
     */
    public getParentDefinition() {
        this.parentDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
    }

    /**
     * set the css class to render the container border
     * default is slds-box--border
     */
    public getClass(){
        let classList: string[] = [];
        if ( this.fieldconfig.cssclass ) {
            classList.push(this.fieldconfig.cssclass);
        } else {
            classList.push("slds-box--border");
        }
        return classList;
    }
}

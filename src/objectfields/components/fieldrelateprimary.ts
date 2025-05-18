/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {relateFilter} from "../../services/interfaces.service";
import {modelutilities} from "../../services/modelutilities.service";
import {fieldRelate} from "./fieldrelate";

@Component({
    selector: 'field-relate-primary',
    templateUrl: '../templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelatePrimary extends fieldRelate implements OnInit, OnDestroy {

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = this.fieldname + '_id';
        this.relateNameField = this.fieldname + '_name';
        this.relateType = 'Accounts'; //fieldDefs.module;
        this.isAuthorized = this.metadata.checkModuleAcl(this.relateType, 'list') || this.metadata.checkModuleAcl(this.relateType, 'listrelated');
        this.handleRelateFIlterField();
    }

    /**
     * a getter for the value bound top the model
     */
    get value() {
        return this.model.getField(this.relateNameField);
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        this.model.setField(this.relateNameField, val);
    }

}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { modellist } from '../../services/modellist.service';
import { language } from '../../services/language.service';
import { popup } from '../../services/popup.service';

@Component({
    selector: 'object-merge-modal-data-field',
    templateUrl: './app/objectcomponents/templates/objectmergemodaldatafield.html',
    providers: [model]
})
export class ObjectMergeModalDataField implements OnInit{

    @Input() fieldname: string = '';
    @Input() fielddata: any = {};

    constructor( private model: model, private modellist: modellist) {
        this.model.module = this.modellist.module;

    }

    ngOnInit(){
        this.model.data = this.fielddata;
    }

}
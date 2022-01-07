/**
 * @module ObjectComponents
 */
import {Component, Input, ViewChild, ViewContainerRef,AfterViewInit} from '@angular/core';
import { model } from '../../services/model.service';
import { metadata } from '../../services/metadata.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-list-item--field',
    templateUrl: '../templates/objectlistitemfield.html'
})
export class ObjectListItemField implements AfterViewInit{
    @ViewChild('fieldcontainer', {read: ViewContainerRef, static: true}) fieldcontainer: ViewContainerRef;

    @Input() field: string = '';

    constructor(public model: model, public language: language, public metadata: metadata) {

    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    buildContainer() {
        this.metadata.addComponent('fieldGeneric', this.fieldcontainer).subscribe(componentRef => {
            componentRef.instance['fieldname'] = this.field;
        });
    }
}

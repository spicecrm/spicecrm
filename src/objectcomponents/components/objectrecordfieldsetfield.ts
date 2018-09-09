import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Input, OnInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

@Component({
    selector: 'object-record-fieldset-field',
    templateUrl: './src/objectcomponents/templates/objectrecordfieldsetfield.html'
})
export class ObjectRecordFieldsetField{

    @Input()fieldsetitem: string = '';


    showLabel(fieldConfig){
        if(fieldConfig.hidelabel === true)
            return false;
        else
            return true;
    }

}
import {Component, Input, Output, Renderer2, ElementRef,EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

declare var moment: any;

@Component({
    selector: 'object-status-network-button-item',
    templateUrl: './src/objectcomponents/templates/objectstatusnetworkbuttonitem.html',
    host:{
        '(click)' : 'this.setStatus()'
    }
})
export class ObjectStatusNetworkButtonItem {

    @Input() item: any = {};
    @Input() statusfield: string = '';
    @Output() status: EventEmitter<string> = new EventEmitter<string>();

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {

    }

    setStatus(){
        this.status.emit(this.item.status_to);
    }

}
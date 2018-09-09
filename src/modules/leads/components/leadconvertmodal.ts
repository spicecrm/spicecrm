import { Component, Input, Output, EventEmitter } from '@angular/core';
import { metadata } from '../../../services/metadata.service';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';

@Component({
    selector: 'lead-convert-modal',
    templateUrl: './src/modules/leads/templates/leadconvertmodal.html'
})
export class LeadConvertModal {

    @Input() saveactions: Array<any> = [];
    @Output() closemodal: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor( private language: language, private metadata: metadata, private model: model ) {

    }

    close(){
        this.closemodal.emit(true);
    }

    itemBorder(index){
        return index < this.saveactions.length - 1;
    }
}
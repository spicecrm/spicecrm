import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { language } from '../../services/language.service';
import { Observable ,  Subject } from 'rxjs';

@Component({
    selector: 'system-await-modal',
    templateUrl: './src/systemcomponents/templates/system-await-modal.html'
})
export class SystemAwaitModal {

    @Input() text: string;

    constructor( )  { }

}
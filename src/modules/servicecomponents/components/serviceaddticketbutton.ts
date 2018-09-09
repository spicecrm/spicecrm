import {AfterViewInit, Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {footer} from '../../../services/footer.service';
import {activitiyTimeLineService} from '../../../services/activitiytimeline.service';



@Component({
    selector: 'service-add-ticket-button',
    templateUrl: './src/modules/servicecomponents/templates/serviceaddticketbutton.html',
    providers: [model]
})
export class ServiceAddTicketButton {

    @Input() servicecall: any = {};
    @Output() click: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private model: model, private language: language) {}

    saveandcreate(){
        this.servicecall.save().subscribe(servicecall => {
            this.click.emit(true);
            this.model.module = 'ServiceTickets';
            this.model.addModel('', this.servicecall);
        })
    }

}
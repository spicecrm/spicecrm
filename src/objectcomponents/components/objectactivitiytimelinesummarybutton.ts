import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';


@Component({
    selector: 'object-activitiytimeline-summary-button',
    templateUrl: './app/objectcomponents/templates/objectactivitiytimelinesummarybutton.html',
})
export class ObjectActivitiyTimelineSummaryButton{


    constructor(private metadata: metadata, private model: model, private language: language, private modal: modal) {
    }

    displaySummary() {
        this.modal.openModal('ObjectActivitiyTimelineSummaryModal').subscribe(modalRef => {
            modalRef.instance.parent = this.model;
        });
    }

}
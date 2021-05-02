/**
 * @module ModuleLeads
 */
import {Component, OnInit,  ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'lead-openleads-dashlet',
    templateUrl: './src/modules/leads/templates/leadopenleadsdashlet.html',
    providers: [model]
})
export class LeadOpenLeadsDashlet implements OnInit {
    private myLeads: any[] = [];
    private myLeadsCount: number = 0;

    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) private tableheader: ViewContainerRef;
    @ViewChild('dashletcontainer', {read: ViewContainerRef, static: true}) private dashletcontainer: ViewContainerRef;

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private elementRef: ElementRef) {

    }

    public ngOnInit() {


        this.backend.getRequest('module/Leads').subscribe((leads: any) => {
            this.myLeads = leads.list;
            this.myLeadsCount = leads.totalcount;
        });
    }

    get containerstyle() {
        if(this.dashletcontainer) {
            let rectc = this.dashletcontainer.element.nativeElement.getBoundingClientRect();
            let rectt = this.tableheader.element.nativeElement.getBoundingClientRect();
            return {
                'height': rectc.bottom - rectt.bottom + 'px',
                'margin-top': '-1px'
            };
        }
    }

}

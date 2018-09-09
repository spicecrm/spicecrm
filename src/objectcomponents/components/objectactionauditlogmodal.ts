import { Component, Input, OnInit, Optional} from '@angular/core';
import { Router } from '@angular/router';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-action-auditlog-modal',
    templateUrl: './app/objectcomponents/templates/objectactionauditlogmodal.html'
})
export class ObjectActionAuditlogModal implements OnInit{

    auditLog: Array<any> = [];
    loading: boolean = true;

    self: any = null

    constructor( private language: language, private metadata: metadata, @Optional() private model: model ) {}

    ngOnInit(){
        if(this.model) {
            this.model.getAuditLog().subscribe(log => {
                this.auditLog = log;
                this.loading = false;
            })
        }
    }

    displayAuditLog(){

    }

    hideAuditLog(){
        this.self.destroy();
    }
}
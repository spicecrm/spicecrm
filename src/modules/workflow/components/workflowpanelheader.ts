import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'workflow-panel-header',
    templateUrl: './app/modules/workflow/templates/workflowpanelheader.html'

})
export class WorkflowPanelHeader implements OnDestroy{

    broadcastSubscription: any = {};
    workflowcount: number = 0;

    constructor(private model: model, private language: language, private broadcast: broadcast) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        })
    }

    get hasWorkFlows(){
        return this.workflowcount > 0 ? true : false;
    }

    handleMessage(message: any) {
        // only handle if the module is the list module
        if (message.messagedata.module !== this.model.module && message.messagedata.id !== this.model.id)
            return;

        switch (message.messagetype) {
            case 'workflows.loaded':
                    this.workflowcount = message.messagedata.workflowcount;
                break;

        }
    }

    ngOnDestroy(){
        this.broadcastSubscription.unsubscribe();
    }

}
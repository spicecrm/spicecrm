import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,Input,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';

@Component({
    selector: 'workflow-panel-item',
    templateUrl: './app/modules/workflow/templates/workflowpanelitem.html',
    //providers: [model]

})
export class WorkflowPanelItem implements OnInit{

    @Input() workflow: any = {};

    hidebody : boolean = false

    constructor(private model: model, private workflowservice: workflow, private language: language, private broadcast: broadcast) {
        //this.model.module = 'Workflows';
    }

    ngOnInit(){
       // this.model.id = this.workflow.id;
    }

    toggleHidden(){
        this.hidebody = !this.hidebody;
    }

    get toggleicon(){
        return this.hidebody ? 'chevrondown' : 'chevronup';
    }

}
import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy, Input
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {workflow} from '../services/workflow.service';
import {broadcast} from '../../../services/broadcast.service';


@Component({
    selector: 'workflow-panel-task-comments',
    templateUrl: './src/modules/workflow/templates/workflowpaneltaskcomments.html'

})
export class WorkflowPanelTaskComments{

    @Input()comments: any = {};
    showComments: boolean = false;

    constructor(private model: model, private workflowservice: workflow, private language: language, private broadcast: broadcast) {

    }

}
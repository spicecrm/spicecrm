import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, ViewChild, ViewContainerRef, OnInit, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';


@Component({
    // selector: 'object-home',
    templateUrl: './app/modules/activities/templates/tasksmanagerview.html',
})
export class TasksManagerView implements OnDestroy{

    modellistsubscribe: any = {};
    focus: string = null;

    constructor(private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model, private modellist: modellist) {

        // subscribe to changes of the listtype
        this.modellistsubscribe = this.modellist.listtype$.subscribe(newType => this.loadList());

        this.loadList();

    }

    ngOnDestroy(){
        this.modellistsubscribe.unsubscribe();
    }

    loadList(){
        this.focus = null;
        this.modellist.sortfield = 'date_due';
        this.modellist.sortdirection = 'ASC';
        this.modellist.getListData(['name', 'parent_type', 'parent_name', 'parent_id', 'date_due', 'assigned_user_name', 'assigned_user_id', 'created_by', 'created_by_name']);
    }

    taskSelected(id){
        this.focus = id;
    }
}
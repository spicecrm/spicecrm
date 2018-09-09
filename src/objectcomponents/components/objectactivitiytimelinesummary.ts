import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    Input, OnInit, OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

declare var moment: any;

@Component({
    selector: 'object-activitiytimeline-summary',
    templateUrl: './app/objectcomponents/templates/objectactivitiytimelinesummary.html',
    providers: [model]
})
export class ObjectActivitiyTimelineSummary{
    @ViewChild('listContainer', {read: ViewContainerRef}) listContainer: ViewContainerRef;
    @ViewChild('detailContainer', {read: ViewContainerRef}) detailContainer: ViewContainerRef;
    showSummary: boolean = false;
    componentRefs: Array<any> = [];

    constructor(private metadata: metadata, private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService) {
    }

    get activities(){
        return this.activitiyTimeLineService.activities.History.list;
    }

    displaySummary() {
        this.showSummary = true;
        if(this.activitiyTimeLineService.activities.History.list.length < 25 && this.activitiyTimeLineService.canLoadMore('History'))
            this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
    }

    onScroll(e) {
        let element = this.listContainer.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            if(this.activitiyTimeLineService.canLoadMore('History'))
                this.activitiyTimeLineService.getMoreTimeLineData('History', 20);
        }
    }

    hideSummary() {
        this.showSummary = false;
    }

    getDate(activity) {

        let dateField = 'date_start';
        switch (activity.module) {
            case 'Tasks':
                dateField = 'date_due';
                break;
            case 'Emails':
            case 'Notes':
                dateField = 'date_entered';
                break;
        }

        let date: Date = new moment(Date.parse(activity.data[dateField]));
        return date.format('DD.MM.YYYY');
    }

    setActivitiy(activity) {
        this.model.module = activity.module;
        this.model.id = activity.id;
        this.model.data = activity.data;

        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineSummary', activity.module);
        if (componentconfig && componentconfig.componentsets) {
            for (let componentSet of componentconfig.componentsets) {
                for (let view of this.metadata.getComponentSetObjects(componentSet)) {
                    this.metadata.addComponent(view.component, this.detailContainer).subscribe(componentRef => {
                        componentRef.instance['componentconfig'] = view.componentconfig;
                        this.componentRefs.push(componentRef);
                    })
                }
            }
        }

    }
}
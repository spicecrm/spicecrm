import {AfterViewInit, Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline-add-tabcontainer',
    templateUrl: './app/objectcomponents/templates/objectactivitytimelineaddtabcontainer.html'
})
export class ObjectActivitiyTimelineAddTabContainer implements OnInit{

    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    @Input()tabcomponent: string = '';
    @Input()componentconfig: any = {};

    constructor( private metadata: metadata) {

    }

    ngOnInit(){
        this.metadata.addComponent(this.tabcomponent, this.container).subscribe(componentRef => {
            componentRef.instance.componentconfig = this.componentconfig;
        })
    }

}
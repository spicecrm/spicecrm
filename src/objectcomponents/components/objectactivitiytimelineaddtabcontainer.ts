/**
 * @module ObjectComponents
 */
import {Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-activitiytimeline-add-tabcontainer',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddtabcontainer.html'
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
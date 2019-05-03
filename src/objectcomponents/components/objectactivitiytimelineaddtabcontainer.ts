/**
 * @module ObjectComponents
 */
import {Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';

/**
 * the container as part of the activitiy stream that holds the add items
 */
@Component({
    selector: 'object-activitiytimeline-add-tabcontainer',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddtabcontainer.html'
})
export class ObjectActivitiyTimelineAddTabContainer implements OnInit {

    /**
     * the ref to the container wher the items are added
     */
    @ViewChild('container', {read: ViewContainerRef}) private container: ViewContainerRef;

    /**
     * the component to be added
     */
    @Input() private tabcomponent: string = '';

    /**
     * the componentconfig for the added component
     */
    @Input() private componentconfig: any = {};

    constructor(private metadata: metadata) {

    }

    public ngOnInit() {
        this.metadata.addComponent(this.tabcomponent, this.container).subscribe(componentRef => {
            componentRef.instance.componentconfig = this.componentconfig;
        });
    }
}

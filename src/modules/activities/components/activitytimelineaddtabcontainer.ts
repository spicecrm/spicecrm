/**
 * @module ModuleActivities
 */
import {Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

/**
 * the container as part of the activitiy stream that holds the add items
 */
@Component({
    selector: 'activitytimeline-add-tabcontainer',
    templateUrl: '../templates/activitytimelineaddtabcontainer.html'
})
export class ActivityTimelineAddTabContainer implements OnInit {

    /**
     * the ref to the container wher the items are added
     */
    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    /**
     * the component to be added
     */
    @Input() public tabcomponent: string = '';

    /**
     * the componentconfig for the added component
     */
    @Input() public componentconfig: any = {};

    constructor(public metadata: metadata) {

    }

    public ngOnInit() {
        this.metadata.addComponent(this.tabcomponent, this.container).subscribe(componentRef => {
            componentRef.instance.componentconfig = this.componentconfig;
        });
    }
}

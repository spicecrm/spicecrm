/**
 * @module ModuleActivities
 */
import {OnInit, Component, Input, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../../services/metadata.service';


@Component({
    selector: 'activitytimeline-item-container',
    templateUrl: '../templates/activitytimelineitemcontainer.html'
})
export class ActivityTimelineItemContainer implements OnInit {

    @ViewChild('container', {read: ViewContainerRef, static: true}) public container: ViewContainerRef;

    /**
     * the activity
     */
    @Input() public activity: any = {};

    /**
     * the module to be displayed
     */
    @Input() public module: string;


    constructor(public metadata: metadata) {}

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ActivityTimelineItemContainer', this.activity.module);
        if(componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for(let component of components) {
                this.metadata.addComponent(component.component, this.container).subscribe(containerElementRef => {
                    containerElementRef.instance.activity = this.activity;
                    containerElementRef.instance.module = this.module;
                    containerElementRef.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }

}

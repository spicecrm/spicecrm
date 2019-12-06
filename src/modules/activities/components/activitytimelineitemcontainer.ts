/**
 * @module ObjectComponents
 */
import {OnInit, Component, Input, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../../services/metadata.service';


@Component({
    selector: 'activitytimeline-item-container',
    templateUrl: './src/modules/activities/templates/activitytimelineitemcontainer.html'
})
export class ActivityTimelineItemContainer implements OnInit {

    @ViewChild('container', {read: ViewContainerRef, static: true}) private container: ViewContainerRef;

    /**
     * the activity
     */
    @Input() private activity: any = {};

    /**
     * the module to be displayed
     */
    @Input() private module: string;


    constructor(private metadata: metadata) {}

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
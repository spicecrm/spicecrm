/**
 * @module ObjectComponents
 */
import {OnInit, Component, Input, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';


@Component({
    selector: 'object-activitiytimeline-item-container',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelineitemcontainer.html'
})
export class ObjectActivitiyTimelineItemContainer implements OnInit {

    @ViewChild('container', {read: ViewContainerRef, static: false}) private container: ViewContainerRef;

    @Input() private activity: any = {};

    constructor(private metadata: metadata) {}

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineItemContainer', this.activity.module);
        if(componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for(let component of components) {
                this.metadata.addComponent(component.component, this.container).subscribe(containerElementRef => {
                    containerElementRef.instance.activity = this.activity;
                });
            }
        }
    }

}
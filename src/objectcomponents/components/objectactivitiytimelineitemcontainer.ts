import {OnInit, Component, Input, ViewContainerRef, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import { activitiyTimeLineService } from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiytimeline-item-container',
    templateUrl: './app/objectcomponents/templates/objectactivitiytimelineitemcontainer.html'
})
export class ObjectActivitiyTimelineItemContainer implements OnInit {

    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    @Input() activity: any = {};

    constructor(private metadata: metadata) {}

    ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineItemContainer', this.activity.module);
        if(componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for(let component of components) {
                this.metadata.addComponent(component.component, this.container).subscribe(containerElementRef => {
                    containerElementRef.instance.activity = this.activity;
                })
            }
        }
    }

}
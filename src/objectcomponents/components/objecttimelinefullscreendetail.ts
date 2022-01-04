/**
 * @module ObjectComponents
 */
import {
    Component, ViewChild, ViewContainerRef,
    Input, OnChanges
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {timeline} from "../../services/timeline.service";

@Component({
    selector: 'object-timeline-full-screen-detail',
    templateUrl: '../templates/objecttimelinefullscreendetail.html',
    providers: [model]
})
export class ObjecttimelineFullScreenDetail implements OnChanges {
    @ViewChild('detailContainer', {read: ViewContainerRef, static: true}) public detailContainer: ViewContainerRef;

    @Input() public module: string;
    @Input() public id: string;
    @Input() public data: object;
    public componentRefs: any[] = [];

    constructor(public metadata: metadata, public parent: model, public model: model, public language: language, public timeline: timeline, public activatedRoute: ActivatedRoute) {

    }

    public ngOnChanges() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.setData(this.data);

        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectTimelineFullScreen', this.module);
        if (componentconfig && componentconfig.componentset) {
            for (let componentSet of componentconfig.componentset) {
                for (let view of this.metadata.getComponentSetObjects(componentSet)) {
                    this.metadata.addComponent(view.component, this.detailContainer).subscribe(componentRef => {
                        componentRef.instance.componentconfig = view.componentconfig;
                        this.componentRefs.push(componentRef);
                    });
                }
            }
        }
    }
}

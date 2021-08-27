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
    templateUrl: './src/objectcomponents/templates/objecttimelinefullscreendetail.html',
    providers: [model]
})
export class ObjecttimelineFullScreenDetail implements OnChanges {
    @ViewChild('detailContainer', {read: ViewContainerRef, static: true}) private detailContainer: ViewContainerRef;

    @Input() private module: string;
    @Input() private id: string;
    @Input() private data: object;
    private componentRefs: any[] = [];

    constructor(private metadata: metadata, private parent: model, private model: model, private language: language, private timeline: timeline, private activatedRoute: ActivatedRoute) {

    }

    public ngOnChanges() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.data = this.data;

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

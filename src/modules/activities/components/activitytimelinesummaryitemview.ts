/**
 * @module ModuleActivities
 */
import {
    Component, ViewChild, ViewContainerRef,
    Input, OnChanges
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';

@Component({
    selector: 'activity-timeline-summary-item-view',
    templateUrl: '../templates/activitytimelinesummaryitemview.html',
    providers: [model]
})
export class ActivityTimelineSummaryItemView implements OnChanges{
    @ViewChild('detailContainer', {read: ViewContainerRef, static: true}) public detailContainer: ViewContainerRef;

    @Input() public module: '';
    @Input() public id: '';
    @Input() public data: '';
    public componentRefs: any[] = [];

    constructor(public metadata: metadata, public parent: model, public model: model, public language: language, public activitiytimeline: activitiytimeline, public activatedRoute: ActivatedRoute) {

    }

    public ngOnChanges() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.setData(this.data, false);

        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ActivityTimelineSummary', this.module);
        if (componentconfig && componentconfig.componentsets) {
            for (let componentSet of componentconfig.componentsets) {
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

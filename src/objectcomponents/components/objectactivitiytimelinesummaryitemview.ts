/**
 * @module ObjectComponents
 */
import {
    Component, ViewChild, ViewContainerRef,
    Input, OnChanges
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

@Component({
    selector: 'object-activitiy-timeline-summary-item-view',
    templateUrl: './src/objectcomponents/templates/objectactivitiytimelinesummaryitemview.html',
    providers: [model]
})
export class ObjectActivitiyTimelineSummaryItemView implements OnChanges{
    @ViewChild('detailContainer', {read: ViewContainerRef, static: false}) private detailContainer: ViewContainerRef;

    @Input() private module: '';
    @Input() private id: '';
    @Input() private data: '';
    private componentRefs: any[] = [];

    constructor(private metadata: metadata, private parent: model, private model: model, private language: language, private activitiyTimeLineService: activitiyTimeLineService, private activatedRoute: ActivatedRoute) {

    }

    public ngOnChanges() {
        this.model.module = this.module;
        this.model.id = this.id;
        this.model.data = this.data;

        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineSummary', this.module);
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
import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-tabbed-details-tab',
    templateUrl: './src/objectcomponents/templates/objectrecordtabbeddetailstab.html'
})
export class ObjectRecordTabbedDetailsTab implements AfterViewInit {

    @ViewChild('panelcontainer', {read: ViewContainerRef}) panelcontainer: ViewContainerRef;

    @Input()componentset: string = '';
    componentRefs: Array<any> = [];

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language) {

    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let panel of this.metadata.getComponentSetObjects(this.componentset)) {
            this.metadata.addComponent(panel.component, this.panelcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

}
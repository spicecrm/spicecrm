import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'dashboard-componentset',
    templateUrl: "./src/modules/dashboard/templates/dashboardcomponentset.html",
})
export class DashboardComponentset implements AfterViewInit, OnDestroy {
    @ViewChild('componentcontainer', {read: ViewContainerRef}) private componentcontainer: ViewContainerRef;
    private dashletconfig: any;
    private componentRefs: Array<any> = [];

    constructor(private metadata: metadata) {
    }

    public ngAfterViewInit() {
        this.renderComnponentset();
    }

    private renderComnponentset() {
        if (this.dashletconfig && this.dashletconfig.componentset) {
            for (let component of this.metadata.getComponentSetObjects(this.dashletconfig.componentset)) {
                this.metadata.addComponent(component.component, this.componentcontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;
                    this.componentRefs.push(componentRef);
                });
            }
        }
    }

    public ngOnDestroy() {
        for (let componentRef of this.componentRefs) {
            componentRef.destroy();
        }
    }
}

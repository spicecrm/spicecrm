/**
 * @module ModuleDashboard
 */
import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'dashboard-componentset',
    templateUrl: "../templates/dashboardcomponentset.html",
})
export class DashboardComponentset implements AfterViewInit, OnDestroy {
    @ViewChild('componentcontainer', {read: ViewContainerRef, static: true}) public componentcontainer: ViewContainerRef;
    public dashletconfig: any;
    public componentRefs: Array<any> = [];

    constructor(public metadata: metadata) {
    }

    public ngAfterViewInit() {
        this.renderComnponentset();
    }

    public ngOnDestroy() {
        for (let componentRef of this.componentRefs) {
            componentRef.destroy();
        }
    }

    public renderComnponentset() {
        if (this.dashletconfig && this.dashletconfig.componentset) {
            for (let component of this.metadata.getComponentSetObjects(this.dashletconfig.componentset)) {
                this.metadata.addComponent(component.component, this.componentcontainer)
                    .subscribe(componentRef => {
                        componentRef.instance.componentconfig = component.componentconfig;
                        this.componentRefs.push(componentRef);
                    });
            }
        }
    }
}

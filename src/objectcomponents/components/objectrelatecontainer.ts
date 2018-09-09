import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-tab-container',
    templateUrl: './src/objectcomponents/templates/objectrelatecontainer.html'
})
export class ObjectRelateContainer implements AfterViewInit, OnDestroy {
    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    moduleName: any = '';
    //relatedDefs: Array<any> = [];
    initialized: boolean = false;
    componentconfig: any = {}

    componentRefs: Array<any> = [];

    constructor(model: model, private activatedRoute: ActivatedRoute, private metadata: metadata) {
        this.moduleName = model.module;
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }
    }

    buildContainer() {
        // get the component config for the relate conmtainer
        let componentconfig = this.metadata.getComponentConfig('ObjectRelateContainer', this.moduleName);

        // if there is none ... do nothing
        if (!componentconfig.componentset)
            return;

        // add the components
        for (let view of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(view.component, this.container).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = view.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }
}
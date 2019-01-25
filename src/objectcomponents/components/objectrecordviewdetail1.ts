import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';

@Component({
    selector: 'object-recordview-detail-1',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetail1.html'

})
export class ObjectRecordViewDetail1 implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('contentcontainer', {read: ViewContainerRef}) private contentcontainer: ViewContainerRef;
    private initialized: boolean = false;
    private componentRefs: any = [];
    private componentSubscriptions: Array<any> = [];
    private listViewDefs: any = [];
    private componentSets: any = {};


    constructor(private metadata: metadata, private model: model, private elementRef: ElementRef) {

    }

    public ngOnInit() {
        if (this.initialized) {
            this.buildContainer();
        }
    }

    public ngOnDestroy() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }


    private buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail1', this.model.module);

        if (componentconfig.main) {
            for (let view of this.metadata.getComponentSetObjects(componentconfig.main)) {
                this.metadata.addComponent(view.component, this.contentcontainer).subscribe(componentRef => {
                    componentRef.instance.componentconfig = view.componentconfig;
                    this.componentRefs.push(componentRef);
                })
            }
        }
    }
}
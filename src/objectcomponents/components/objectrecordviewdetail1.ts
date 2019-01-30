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
export class ObjectRecordViewDetail1 implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef}) private contentcontainer: ViewContainerRef;
    private initialized: boolean = false;
    private componentconfig: any = {};

    constructor(private metadata: metadata, private model: model, private elementRef: ElementRef) {

    }

    public ngOnInit() {
            this.getComponentconfig();
    }

    private getComponentconfig() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail1', this.model.module);
    }
}

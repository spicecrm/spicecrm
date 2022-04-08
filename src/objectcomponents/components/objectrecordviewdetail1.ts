/**
 * @module ObjectComponents
 */
import {
    Component, ViewChild, ViewContainerRef,
    ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

declare var _: any;

@Component({
    selector: 'object-recordview-detail-1',
    templateUrl: '../templates/objectrecordviewdetail1.html'

})
export class ObjectRecordViewDetail1 implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef, static: true}) public contentcontainer: ViewContainerRef;
    public initialized: boolean = false;
    public componentconfig: any = {};

    constructor(public metadata: metadata, public model: model, public elementRef: ElementRef) {

    }

    public ngOnInit() {
        this.getComponentconfig();
    }

    public getComponentconfig() {
        if (_.isEmpty(this.componentconfig)) {
            this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail1', this.model.module);
        }
    }
}

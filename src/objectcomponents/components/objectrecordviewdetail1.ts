/**
 * @module ObjectComponents
 */
import {
     Component, ViewChild, ViewContainerRef,
    ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-recordview-detail-1',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetail1.html'

})
export class ObjectRecordViewDetail1 implements OnInit {
    @ViewChild('contentcontainer', {read: ViewContainerRef, static: true}) private contentcontainer: ViewContainerRef;
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

/**
 * @module ObjectComponents
 */
import {
    Component, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

declare var _: any;

@Component({
    selector: 'object-recordview-detail-1and2and1',
    templateUrl: '../templates/objectrecordviewdetail1and2and1.html',
    standalone: false
})
export class ObjectRecordViewDetail1and2and1 implements OnInit {
    public initialized: boolean = false;
    public componentconfig: any = {};

    constructor(public metadata: metadata, public model: model) {

    }

    public ngOnInit() {
            this.getComponentconfig();
    }

    public getComponentconfig() {
        if(_.isEmpty(this.componentconfig)) {
            this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail1and2and1', this.model.module);
        }
    }
}

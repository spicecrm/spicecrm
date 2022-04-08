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
    selector: 'object-recordview-detail-2and1',
    templateUrl: '../templates/objectrecordviewdetail2and1.html'

})
export class ObjectRecordViewDetail2and1 implements OnInit {
    public initialized: boolean = false;
    public componentconfig: any = {};

    constructor(public metadata: metadata, public model: model) {

    }

    public ngOnInit() {
            this.getComponentconfig();
    }

    public getComponentconfig() {
        if(_.isEmpty(this.componentconfig)) {
            this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail2and1', this.model.module);
        }
    }
}

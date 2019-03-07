/**
 * @module ObjectComponents
 */
import {
    Component, ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    selector: 'object-recordview-detail-2and1',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetail2and1.html'

})
export class ObjectRecordViewDetail2and1 implements OnInit {
    private initialized: boolean = false;
    private componentconfig: any = {};

    constructor(private metadata: metadata, private model: model, private elementRef: ElementRef) {

    }

    public ngOnInit() {
            this.getComponentconfig();
    }

    private getComponentconfig() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetail2and1', this.model.module);
    }
}
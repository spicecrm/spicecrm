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
    selector: 'object-recordview-detail-split',
    templateUrl: './src/objectcomponents/templates/objectrecordviewdetailsplit.html'

})
export class ObjectRecordViewDetailsplit implements OnInit {

    public componentconfig: any = {};

    public constructor(private metadata: metadata, private model: model) {

    }


    public ngOnInit() {
        this.getComponentconfig();
    }

    private getComponentconfig() {
        if(_.isEmpty(this.componentconfig) || (!this.componentconfig.left && !this.componentconfig.right)) {
            this.componentconfig = this.metadata.getComponentConfig('ObjectRecordViewDetailsplit', this.model.module);
        }
    }
}

/**
 * @module ObjectComponents
 */
import {
    Component,  OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';

@Component({
    templateUrl: '../templates/objectrelatecontainer.html'
})
export class ObjectRelateContainer implements OnInit {

    public componentconfig: any = {};
    public componentset: string;

    constructor(public model: model, public metadata: metadata) {
    }

    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRelateContainer', this.model.module);
        this.componentset = componentconfig.componentset;
    }

    /**
     * checks that we have access
     */
    get hasAccess() {
        return this.model.checkAccess('detail');
    }
}

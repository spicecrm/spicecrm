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

    /**
     * holds an array with items for the number of stencils to be rendered
     */
    public stencils: any[] = [];

    constructor(public model: model, public metadata: metadata) {
    }

    public ngOnInit() {
        if(!this.componentconfig.componentset) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRelateContainer', this.model.module);
            this.componentset = componentconfig.componentset;
        } else {
            this.componentset = this.componentconfig.componentset;
        }

        // fill the array with items so the stencils get rendered. Default is 3 but can be set from the config
        this.stencils = Array(this.componentconfig.stencils ?? 3);
    }

    /**
     * checks that we have access
     */
    get hasAccess() {
        return this.model.checkAccess('detail');
    }
}

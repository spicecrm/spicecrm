/**
 * @module ModuleSpiceImports
 */
import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {model} from '../../../services/model.service';


@Component({
    selector: 'spice-imports-view-log-container',
    templateUrl: '../templates/spiceimportsviewlogcontainer.html',
})
export class SpiceImportsViewLogContainer{


    constructor(
        public model: model
    ) {
    }

    get status(){
        return this.model.getField('status');
    }

    get module(){
        return this.model.getField('module');
    }

}

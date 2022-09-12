/**
 * @module ModuleExchange
 */
import {Component, ComponentRef} from '@angular/core';

@Component({
    templateUrl: '../templates/msgraphmappingmodal.html',
})
export class MSGraphMappingModal {

    public mapping = [];

    public self: ComponentRef<MSGraphMappingModal>;

    public close() {
        this.self.destroy();
    }
}

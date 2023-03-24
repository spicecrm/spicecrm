/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {metadata} from "../../services/metadata.service";


@Component({
    selector: 'hooks-manager',
    templateUrl: '../templates/hooksmanager.html',
})
export class HooksManager {
    public hook: any;
    public activeTab: string = 'logic';
    public _module: string = '*';
    public modules: string[];

    public hooksManager =
        [{label: 'Logic Hooks', value: 'logic'}, {label: 'Web Hooks', value: 'web'}];

    constructor(public metadata: metadata,) {
        this.modules = this.metadata.getModules();
        this.modules.sort();
    }
    /**
     * get module
     */
    get module() {
        return this._module;
    }

    /**
     * set module
     * @param module
     */
    set module(module) {
        if (module != this._module) {
            this._module = module;
        }
    }
}

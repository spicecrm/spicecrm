/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';

@Component({
    selector: 'hooks-manager',
    templateUrl: '../templates/hooksmanager.html',
})
export class HooksManager {
    public hook: any;
    public activeTab: string = 'logic';

    public hooksManager =
        [{label: 'Logic Hooks', value: 'logic'}, {label: 'Web Hooks', value: 'web'}];

}

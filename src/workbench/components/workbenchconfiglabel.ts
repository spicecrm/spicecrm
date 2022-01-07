/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';

@Component({
    templateUrl: '../templates/workbenchconfiglabel.html',
    selector: 'workbench-config-label'
})

export class WorkbenchConfigLabel {
    @Input() public option: string = '';
    @Input() public description: string = '';
    public showInfo = false;
}

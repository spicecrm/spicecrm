/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input
} from '@angular/core';

@Component({
    templateUrl: './src/workbench/templates/workbenchconfiglabel.html',
    selector: 'workbench-config-label'
})

export class WorkbenchConfigLabel {
    @Input() private option: string = '';
    @Input() private description: string = '';
}

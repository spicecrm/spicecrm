import {Component, Input} from '@angular/core';

@Component({
    selector: 'spice-kanban-manager-preview',
    templateUrl: '../templates/spicekanbanmanagerpreview.html',
    standalone: false
})

export class SpiceKanbanManagerPreview{

    @Input() active: any;

}

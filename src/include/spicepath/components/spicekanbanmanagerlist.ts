import {Component} from '@angular/core';

@Component({
    selector: 'spice-kanban-manager-list',
    templateUrl: '../templates/spicekanbanmanagerlist.html'
})

export class SpiceKanbanManagerList {
    public enumValues = Array.from({length: 50}, (_,i) => 'Item ' + i);
}

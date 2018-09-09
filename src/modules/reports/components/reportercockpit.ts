import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'reporter-cockpit',
    templateUrl: './app/modules/reports/templates/reportercockpit.html'
})
export class ReporterCockpit {

    cockpits: Array<any> = [];

    constructor(private backend: backend) {
        this.backend.getRequest('KReporter/categoriesmanager/cockpit').subscribe(cockpits => {
            for(let cockpit in cockpits){
                this.cockpits.push({
                    name: cockpit,
                    items: cockpits[cockpit]
                });
            }
        });
    }

}
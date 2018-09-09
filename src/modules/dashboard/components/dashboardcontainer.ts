import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {navigation} from '../../../services/navigation.service';
import {broadcast} from '../../../services/broadcast.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainer.html',
    providers: [model, dashboardlayout]
})
export class DashboardContainer {

    @Input() dashboardid: string = '';
    @Input() context: string = 'Dashboard';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private elementRef: ElementRef) {
    }


}
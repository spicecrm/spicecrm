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
    selector: 'dashboard-container-header',
    templateUrl: './app/modules/dashboard/templates/dashboardcontainerheader.html'
})
export class DashboardContainerHeader {

    @Input() dashboardid: string = '';

    constructor(private dashboardlayout: dashboardlayout, private language: language, private renderer: Renderer, private elementRef: ElementRef) {

    }



    toggleEditMode(){
        this.dashboardlayout.editMode = !this.dashboardlayout.editMode;
    }

    get editable(){
        return this.dashboardlayout.model.checkAccess('edit') && !this.dashboardlayout.editMode;
    }

    get canDelete(){
        return this.dashboardlayout.model.checkAccess('delete');
    }

    edit(){
        this.dashboardlayout.model.edit();
    }

    deleteDashlet(){
        this.dashboardlayout.model.delete();
    }

}
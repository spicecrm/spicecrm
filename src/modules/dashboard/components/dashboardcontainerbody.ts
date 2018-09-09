import {
    Component,
    Input,
    AfterViewInit,
    OnInit,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy, OnChanges
} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-body',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerbody.html',
    styles: [
        `.slds-button--icon {color: #eeeeee}
        .slds-button--icon:hover {color: #5B5B5B}`
    ]
})
export class DashboardContainerBody implements AfterViewInit, OnInit, OnDestroy, OnChanges {
    @ViewChild('bodycontainer', {read: ViewContainerRef}) bodycontainer: ViewContainerRef;
    @Input() dashboardid: string = '';
    resizeListener: any = {};

    constructor(private dashboardlayout: dashboardlayout, private language: language, private elementRef: ElementRef, private renderer: Renderer2) {
        this.resizeListener = this.renderer.listen('window', 'resize', () => this.calculateGrid());
        this.renderer.listen('window', 'mousemove',(event)=> {
            if (this.dashboardlayout.editMode&& this.dashboardlayout.isMoving){
                if (event.pageY < (this.dashboardlayout.mainContainer.top + 20) && this.bodycontainer.element.nativeElement.scrollTop > 0)
                    this.bodycontainer.element.nativeElement.scrollTop -= ((this.dashboardlayout.mainContainer.top + 20) - event.pageY) * ((this.dashboardlayout.mainContainer.top + 20) - event.pageY);
                if (event.pageY > (this.dashboardlayout.mainContainer.bottom - 20))
                    this.bodycontainer.element.nativeElement.scrollTop += (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20)) * (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20));
            }
        });
    }

    ngOnInit() {
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    ngOnChanges(){
        this.dashboardlayout.loadDashboard(this.dashboardid);
    }

    ngAfterViewInit() {
        this.calculateGrid();
    }

    ngOnDestroy() {
        this.resizeListener();
    }

    get isEditing(){
        return this.dashboardlayout.editMode === true ? true : false;
    }

    get bodyContainerStyle(){
        return {
            height: 'calc(97vh - ' + this.bodycontainer.element.nativeElement.getBoundingClientRect().top + 'px)',
            border: this.dashboardlayout.editMode ? '1px dashed #ca1b21' : '0',
            'padding-right': this.dashboardlayout.paddingRight + 'px'
        };
    }

    calculateGrid() {
        this.dashboardlayout.mainContainer = this.elementRef.nativeElement.getBoundingClientRect();
        this.dashboardlayout.calculateGrid();
    }

    addDashlet(column){
        this.dashboardlayout.addDashlet(column);
    }

}
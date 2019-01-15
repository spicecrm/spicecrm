import {
    Component,
    AfterViewInit,
    ElementRef,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    OnDestroy,
} from '@angular/core';
import {language} from '../../../services/language.service';
import {dashboardlayout} from '../services/dashboardlayout.service';


@Component({
    selector: 'dashboard-container-body',
    templateUrl: './src/modules/dashboard/templates/dashboardcontainerbody.html',
    styles: [
            `.slds-button--icon {
            color: #eeeeee
        }

        .slds-button--icon:hover {
            color: #5B5B5B
        }`
    ]
})
export class DashboardContainerBody implements AfterViewInit, OnDestroy {
    @ViewChild('bodycontainer', {read: ViewContainerRef}) private bodycontainer: ViewContainerRef;
    private resizeListener: any = {};

    constructor(private dashboardlayout: dashboardlayout, private language: language, private elementRef: ElementRef, private renderer: Renderer2) {
        this.resizeListener = this.renderer.listen('window', 'resize', () => this.calculateGrid());
        this.renderer.listen('window', 'mousemove', (event) => {
            if (this.dashboardlayout.editMode && this.dashboardlayout.isMoving) {
                if (event.pageY < (this.dashboardlayout.mainContainer.top + 20) && this.bodycontainer.element.nativeElement.scrollTop > 0) {
                    this.bodycontainer.element.nativeElement.scrollTop -= ((this.dashboardlayout.mainContainer.top + 20) - event.pageY) * ((this.dashboardlayout.mainContainer.top + 20) - event.pageY);
                }
                if (event.pageY > (this.dashboardlayout.mainContainer.bottom - 20)) {
                    this.bodycontainer.element.nativeElement.scrollTop += (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20)) * (event.pageY - (this.dashboardlayout.mainContainer.bottom - 20));
                }
            }
        });
    }

    public ngAfterViewInit() {
        this.calculateGrid();
    }

    public ngOnDestroy() {
        this.resizeListener();
    }

    get isEditing() {
        return this.dashboardlayout.editMode;
    }

    get bodyContainerStyle() {
        return {
            'border': this.dashboardlayout.editMode ? '1px dashed #ca1b21' : '0',
            'width': '100%'
        };
    }

    private calculateGrid() {
        this.dashboardlayout.mainContainer = {
            width: this.bodycontainer.element.nativeElement.clientWidth,
            height: this.bodycontainer.element.nativeElement.clientHeight
        };
        this.dashboardlayout.calculateGrid();
    }

    private addDashlet(column) {
        this.dashboardlayout.addDashlet(column);
    }
}

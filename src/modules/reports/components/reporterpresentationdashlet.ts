/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    AfterViewInit,
    Output,
    EventEmitter,
    ViewChild,
    ViewContainerRef,
    ElementRef, OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';

import {reporterconfig} from '../services/reporterconfig';
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import {Subject} from "rxjs";

@Component({
    selector: 'reporter-presentation-dashlet',
    templateUrl: '../templates/reporterpresentationdashlet.html',
    providers: [model, reporterconfig],
    styles: [
        ':host {width:100%; height: 100%;}'
    ]
})
export class ReporterPresentationDashlet implements AfterViewInit, OnInit {
    /**
     * rewference to the contaioner that will hold the presentation component
     */
    @ViewChild('presentationcontainer', {
        read: ViewContainerRef,
        static: true
    }) public presentationcontainer: ViewContainerRef;

    @Input() public parentModule: string = '';
    @Input() public parentId: string = '';
    @Input() public displayheader: boolean = true;

    @Input() public componentconfig: any = {};

    /**
     * observable listening whether reload button was clicked on parent
     */
    @Input() refreshReport: Subject<boolean> = new Subject<boolean>();

    /**
     * emites the title after the report is loaded
     */
    @Output() public dashletTitle: EventEmitter<string> = new EventEmitter<string>();

    public presComponent: any = undefined;

    /**
     * emit if a no access or not found error has been raised by the backend
     * allows to hide the container for the report dashlet
     */
    @Output() public noAccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public model: model,
                public metadata: metadata,
                public elementRef: ElementRef,
                public toast: toast,
                public language: language,
                public reporterconfig: reporterconfig) {
    }

    public ngAfterViewInit() {
        if (this.componentconfig.reportid !== '') {
            this.model.module = 'KReports';
            this.model.id = this.componentconfig.reportid;
            if (this.parentId && this.parentModule) {
                this.model['parentBeanId'] = this.parentId;
                this.model['parentBeanModule'] = this.parentModule;
            }
            this.model.getData().subscribe( {
                next: (data) => {
                    // emit the title
                    this.dashletTitle.emit(this.model.getField('name'));

                    // render the report
                    this.renderPresentation();
                }, error: (err) => {
                    if (err.status == '403' || err.status == '404') {
                        this.noAccess.emit(true);
                    } else {
                        this.toast.sendToast(this.language.getLabel("LBL_ERROR_LOADING_DATA"), "error");
                    }
                }
            });
        }
    }

    public ngOnInit() {

        // subscribe to reload button on the parent
        this.refreshReport.subscribe(response => {
            if (response) {
                this.reporterconfig.refresh();
            }
        });
    }


    /**
     * calculates the offset of the header and sets the proper style so the presentation conatiner has a defined height to fit in
     */
    get containerstyle() {
        let presrect = this.presentationcontainer.element.nativeElement.getBoundingClientRect();

        return {
            height: "calc(100% - " + this.presentationcontainer.element.nativeElement.offsetTop + 'px)'
        };

    }

    /**
     * opens the report
     */
    public openReport() {
        this.model.goDetail();
    }

    /**
     * renders the presentation
     */
    public renderPresentation() {
        if (this.presComponent) {
            this.presComponent.destroy();
            this.presComponent = undefined;
        }

        let presentationParams = this.model.getField('presentation_params');

        let presentationComponent = '';
        switch (presentationParams.plugin) {
            case 'standard':
                presentationComponent = 'ReporterDetailPresentationStandard';
                break;
            case 'grouped':
                presentationComponent = 'ReporterDetailPresentationGrouped';
                break;
            case 'standardws':
                presentationComponent = 'ReporterDetailPresentationStandardWS';
                break;
            case 'tree':
                presentationComponent = 'ReporterDetailPresentationTree';
                break;
            case 'pivot':
                presentationComponent = 'ReporterDetailPresentationPivot';
                break;

        }

        if (presentationComponent != '') {
            this.metadata.addComponent(presentationComponent, this.presentationcontainer).subscribe(componentRef => {
                // do not show a footer
                componentRef.instance.showFooter = false;
                this.presComponent = componentRef;
            });
        }
    }
}

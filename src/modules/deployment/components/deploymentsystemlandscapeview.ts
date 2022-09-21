/**
 * @module ModuleDeployment
 */
import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {DeploymentSystemLandscapeService} from "../services/deploymentsystemlandscape.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {LandscapeItemI} from "../interfaces/deployment.interfaces";
import {CdkDragEnd} from "@angular/cdk/drag-drop";

/**
 * landscape view to manage deployment system landscape
 */
@Component({
    selector: 'deployment-system-landscape-view',
    templateUrl: '../templates/deploymentsystemlandscapeview.html',
    providers: [DeploymentSystemLandscapeService],
})
export class DeploymentSystemLandscapeView implements OnInit {

    public show: boolean = true;

    constructor(public backend: backend,
                public navigationtab: navigationtab,
                public eRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public dsl: DeploymentSystemLandscapeService) {
    }

    public ngAfterViewInit() {
        this.dsl.container = this.eRef.nativeElement;
    }

    public ngOnInit() {
        this.navigationtab.setTabInfo({
            displayname: 'System Landscape',
            displayicon: 'data_mapping'
        })
    }

    public handleDragEnd(item: LandscapeItemI, dragEvent: CdkDragEnd) {

        this.show = false;
        this.cdRef.detectChanges();

        item.position = {
            left: item.position.left + dragEvent.distance.x,
            top: item.position.top + dragEvent.distance.y,
        }

        item.name.position = {
            x: item.name.position.x + dragEvent.distance.x,
            y: item.name.position.y + dragEvent.distance.y,
        }

        this.dsl.adjustConnectors(item);

        this.show = true;

    }

    public add(item, itemContainer: HTMLElement) {
        this.dsl.add(item, itemContainer);
    }
}

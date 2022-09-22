/**
 * @module ModuleDeployment
 */
import {ChangeDetectorRef, Component, ElementRef, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {DeploymentSystemLandscapeService} from "../services/deploymentsystemlandscape.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {LandscapeItemI} from "../interfaces/deployment.interfaces";
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {model} from "../../../services/model.service";

/**
 * landscape view to manage deployment system landscape
 */
@Component({
    selector: 'deployment-system-landscape-view',
    templateUrl: '../templates/deploymentsystemlandscapeview.html',
    providers: [model, DeploymentSystemLandscapeService],
})
export class DeploymentSystemLandscapeView implements OnInit {

    public show: boolean = true;
    public isLinking: boolean = false;

    constructor(public backend: backend,
                public navigationtab: navigationtab,
                public eRef: ElementRef,
                public cdRef: ChangeDetectorRef,
                public model: model,
                public dsl: DeploymentSystemLandscapeService) {
    }

    /**
     * set the view container
     */
    public ngAfterViewInit() {
        this.dsl.container = this.eRef.nativeElement;
    }

    /**
     * set navigation tab info
     */
    public ngOnInit() {
        this.navigationtab.setTabInfo({
            displayname: 'System Landscape',
            displayicon: 'data_mapping'
        });

        this.model.module = 'SystemDeploymentSystems';
    }

    /**
     * handle item drag end to adjust the connectors
     * @param item
     * @param dragEvent
     */
    public handleItemDragEnd(item: LandscapeItemI, dragEvent: CdkDragEnd) {

        // workaround to clear the drag translate style
        this.show = false;
        this.cdRef.detectChanges();

        item.position = {
            x: item.position.x + dragEvent.distance.x,
            y: item.position.y + dragEvent.distance.y,
        }

        item.name.position = {
            x: item.name.position.x + dragEvent.distance.x,
            y: item.name.position.y + dragEvent.distance.y,
        }

        this.dsl.adjustConnectors(item);

        this.show = true;
    }

    /**
     * handle link drag end to connect two items
     * @param item
     * @param dragEvent
     */
    public handleLinkDragEnd(item: LandscapeItemI, dragEvent: CdkDragEnd) {

        const targetId = (dragEvent.event.target as any).id;

        if (!targetId) return;

        const target = this.dsl.data.find(e => e.id == targetId);

        if (!target) return;

        this.isLinking = false;

        this.dsl.connect(item, target);
    }

    /**
     * add new item
     * @param item
     * @param itemContainer
     */
    public add(item, itemContainer: HTMLElement) {
        this.dsl.add(item, itemContainer);
    }
}

/**
 * @module GlobalComponents
 */
import {
    AfterViewInit, AfterViewChecked, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef
} from '@angular/core';
import {MenuService} from '../services/menu.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-navigation',
    templateUrl: './src/globalcomponents/templates/globalnavigation.html',
    providers: [MenuService]
})
export class GlobalNavigation{
    @ViewChild('menucontainer', {read: ViewContainerRef}) private menucontainer: ViewContainerRef;

    // timeout funciton to handle resize event ... to not render after any time the event is triggered but the size is stable for some time
    private resizeTimeOut: any = undefined;

    constructor(private menuService: MenuService, private metadata: metadata, private elementRef: ElementRef, private broadcast: broadcast) {
        menuService.loadModules();

    }

}

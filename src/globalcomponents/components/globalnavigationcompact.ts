import {
    AfterViewInit, AfterViewChecked, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef
} from '@angular/core';
import {MenuService} from '../services/menu.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-navigation-compact',
    templateUrl: './src/globalcomponents/templates/globalnavigationcompact.html',
    providers: [MenuService]
})
export class GlobalNavigationCompact {

    // timeout funciton to handle resize event ... to not render after any time the event is triggered but the size is stable for some time

    private showmenu: boolean = false;

    constructor(private menuService: MenuService, private metadata: metadata, private elementRef: ElementRef, private broadcast: broadcast) {

    }

    private toggleMenu() {
        this.showmenu = !this.showmenu;
    }

    get menustyle() {
        return {
            left: this.showmenu ? '0px' : '-200px'
        };
    }
}

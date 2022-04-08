/**
 * @module GlobalComponents
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    ElementRef,
    NgModule,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Router}   from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';

interface menuItem {
    module: string;
    name: string;
}

@Component({
    selector: 'global-navigation-menu-more',
    templateUrl: '../templates/globalnavigationmenumore.html',
    host: {
        '[class.slds-context-bar__item]': 'true'
    }
})
export class GlobalNavigationMenuMore implements AfterViewInit{
    constructor(public language: language,public router: Router,public elementRef: ElementRef,public broadcast: broadcast) {}

   public moreMenuItems: any[] = [];

   public navigateTo(module) {
        this.router.navigate(['/module/' + module]);
    }

    public ngAfterViewInit(){
        this.broadcast.broadcastMessage('navigation.moreadded', {
            module: 'more',
            width: this.elementRef.nativeElement.offsetWidth
        });
    }
}

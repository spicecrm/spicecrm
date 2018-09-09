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
import {MenuService} from '../services/menu.service';
import {broadcast} from '../../services/broadcast.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';

interface menuItem {
    module: string;
    name: string
}

@Component({
    selector: 'global-navigation-menu-more',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenumore.html',
    host: {
        '[class.slds-context-bar__item]': 'true'
    }
})
export class GlobalNavigationMenuMore implements AfterViewInit{
    constructor(private language: language, private router: Router, private elementRef: ElementRef, private broadcast: broadcast) {}

    moreMenuItems: Array<any> = [];

    navigateTo(module) {
        this.router.navigate(['/module/' + module]);
    }

    ngAfterViewInit(){
        this.broadcast.broadcastMessage('navigation.moreadded', {
            module: 'more',
            width: this.elementRef.nativeElement.offsetWidth
        })
    }
}

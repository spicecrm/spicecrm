import {AfterViewInit, ComponentFactoryResolver, Component, Input, ElementRef, Renderer, Renderer2, NgModule, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {popup} from '../../services/popup.service';
import {model} from '../../services/model.service';
import {recent} from '../../services/recent.service';
import {favorite} from '../../services/favorite.service';
import {language} from '../../services/language.service';
import {navigation} from '../../services/navigation.service';
import {metadata} from '../../services/metadata.service';

interface menuItem {
    module: string;
    name: string
}


@Component({
    selector: 'global-navigation-menu-item-new',
    templateUrl: './app/globalcomponents/templates/globalnavigationmenuitemnew.html'
})
export class GlobalNavigationMenuItemNew  {
    clickListener: any;

    constructor(private metadata: metadata,
                private language: language,
                private model: model,
                private renderer: Renderer2) {
    }

    exceuteItem(){
        this.model.addModel();
    }

}

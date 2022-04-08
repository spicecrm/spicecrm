/**
 * @module GlobalComponents
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    ElementRef,
    Renderer2,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

interface menuItem {
    module: string;
    name: string;
}

/**
 * @deprecated
 */
@Component({
    selector: 'global-navigation-menu-item-new',
    templateUrl: '../templates/globalnavigationmenuitemnew.html'
})
export class GlobalNavigationMenuItemNew {

    constructor(public language: language,public model: model) {
    }

    public exceuteItem() {
        this.model.id = '';
        this.model.addModel();
    }

}

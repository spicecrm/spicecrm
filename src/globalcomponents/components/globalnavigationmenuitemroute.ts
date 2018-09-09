import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    ElementRef,
    Renderer,
    Renderer2,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
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
    selector: 'global-navigation-menu-item-route',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemroute.html'
})
export class GlobalNavigationMenuItemRoute {
    clickListener: any;
    actionconfig: any = {};

    constructor(private metadata: metadata,
                private language: language,
                private model: model,
                private router: Router) {
    }

    get actionicon() {
        return this.actionconfig.icon ? this.actionconfig.icon : 'chevronright';
    }

    get actionlabel() {
        if (this.actionconfig.label && this.actionconfig.label.indexOf(':') > -1) {
            let labelData = this.actionconfig.label.split(':');
            return this.language.getLabel(labelData[0], labelData[1]);
        } else
            return this.language.getLabel(this.actionconfig.label);
    }

    exceuteItem() {
        this.router.navigate([this.actionconfig.route]);
    }

}

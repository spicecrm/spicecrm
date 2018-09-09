import {Component, AfterViewInit, ViewContainerRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'global-header-tools',
    templateUrl: './app/globalcomponents/templates/globalheadertools.html'
})
export class GlobalHeaderTools implements AfterViewInit{

    @ViewChild('toolcontainer', {read: ViewContainerRef}) toolcontainer: ViewContainerRef;

    constructor(private session: session, private metadata: metadata, private router: Router, private language: language){

    }

    ngAfterViewInit(){
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderTools');

        if(!componentconfig.componentset) return false;

        let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
        for(let component of components){
            this.metadata.addComponent(component.component, this.toolcontainer);
        }
    }

}
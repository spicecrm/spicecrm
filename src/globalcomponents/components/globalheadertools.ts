/**
 * @module GlobalComponents
 */
import {Component, AfterViewInit, ViewContainerRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-tools',
    templateUrl: '../templates/globalheadertools.html'
})
export class GlobalHeaderTools implements AfterViewInit {

    @ViewChild('toolcontainer', {read: ViewContainerRef, static: true})public toolcontainer: ViewContainerRef;
   public containerItems: any[] = [];

    constructor(public session: session,public metadata: metadata,public router: Router,public language: language,public broadcast: broadcast) {
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    public ngAfterViewInit() {
        this.buildTools();
    }

   public handleMessage(message) {
        switch (message.messagetype) {
            case 'applauncher.setrole':
            case 'loader.reloaded':
                this.buildTools();
                break;

        }
    }

   public buildTools() {

        // destrioy the current container
        this.containerItems.forEach(item => {
            item.destroy();
        });
        this.containerItems = [];

        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderTools');
        if (!componentconfig.componentset) return false;
        let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
        for (let component of components) {
            this.metadata.addComponent(component.component, this.toolcontainer).subscribe(itemRef => {
                this.containerItems.push(itemRef);
            });
        }
    }

}

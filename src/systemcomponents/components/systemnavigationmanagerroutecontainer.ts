import {
    Component,
    Input,
    OnInit, ViewChild, ViewContainerRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {Router} from '@angular/router';
import {broadcast} from '../../services/broadcast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {navigation, routeObject} from '../../services/navigation.service';
import {Subject, Observable} from 'rxjs';

declare var _: any;

@Component({
    selector: 'system-navigation-manager-route-container',
    templateUrl: './src/systemcomponents/templates/systemnavigationmanagerroutecontainer.html',
})
export class SystemNavigationManagerRouteContainer {
    @ViewChild('objectcontainer', {read: ViewContainerRef}) private objectcontainer: ViewContainerRef;

    @Input() private object: routeObject;
    private loaded = false;
    private isActive: boolean = true;

    constructor(private metadata: metadata, private language: language, private router: Router, private broadcast: broadcast, private navigation: navigation, private changeDetectorRef: ChangeDetectorRef) {
        this.navigation.activeRoute$.subscribe(activeRoute => {
            if(_.isEqual(this.object.params, activeRoute.params)) {
                this.isActive = true;
                this.changeDetectorRef.reattach();
            } else {
                this.isActive = false;
                this.changeDetectorRef.detach();
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /*
    public ngOnInit() {

        switch(this.object.path) {
            case 'module/:module/:id':
                this.metadata.addComponent('ObjectRecordView2', this.objectcontainer).subscribe(componentRef => {
                   componentRef.instance.module = this.object.params.module;
                   componentRef.instance.id = this.object.params.id;
                });
                break;
            default:
                break;
        }
    }
    */

    /*
    get isActive() {
        return this.navigation.checkActiveRoute(this.object);
    }
    */

    public addComponent(component, params) {
        let intfunc = setInterval(() => { this.changeDetectorRef.detectChanges(); }, 50);

        this.metadata.addComponent(component, this.objectcontainer).subscribe(componentRef => {
            componentRef.instance.module = params.module;
            componentRef.instance.id = params.id;
            this.loaded = true;
        });
    }
}

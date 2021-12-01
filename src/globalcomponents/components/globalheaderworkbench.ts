/**
 * @module GlobalComponents
 */
import {AfterViewInit, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-header-workbench',
    templateUrl: '../templates/globalheaderworkbench.html'
})
export class GlobalHeaderWorkbench {

    constructor(public session: session,public router: Router,public language: language) {

    }

   public isAdmin(){
        return this.session.isAdmin;
    }

   public goAdmin(){
        this.router.navigate(['/admin']);
    }

}

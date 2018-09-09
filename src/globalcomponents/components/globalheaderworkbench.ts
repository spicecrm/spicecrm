import {AfterViewInit, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-header-workbench',
    templateUrl: './src/globalcomponents/templates/globalheaderworkbench.html'
})
export class GlobalHeaderWorkbench {

    constructor( private session: session, private router: Router, private language: language) {

    }

    isAdmin(){
        return this.session.isAdmin;
    }

    goAdmin(){
        this.router.navigate(['/admin']);
    }

}
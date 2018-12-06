import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    NgModule,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    Renderer,
    EventEmitter,
    HostListener
} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {fts} from '../../services/fts.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';

@Component({
    selector: 'global-header-search',
    templateUrl: './src/globalcomponents/templates/globalheadersearch.html',
    providers: [popup],
    host: {
        //  '(document:click)': 'this.onClick($event)'
    }
})
export class GlobalHeaderSearch {
    private showRecent: boolean = false;
    private searchTimeOut: any = undefined;
    private searchTerm: string = '';
    private searchTermUntrimmed: string = '';
    private clickListener: any;

    constructor(private router: Router, private broadcast: broadcast, private fts: fts, private elementRef: ElementRef, private renderer: Renderer, private popup: popup, private language: language) {
        popup.closePopup$.subscribe(close => {
            this.closePopup();
        });
    }

    private onFocus() {
        this.showRecent = true;
        this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
    }

    private closePopup() {
        this.clickListener();
        this.showRecent = false;
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
    }

    private doSearch() {
        this.searchTerm = this.searchTermUntrimmed.trim();
        if (this.searchTerm.length && this.searchTerm !== this.fts.searchTerm) {
            // start the search
            this.fts.search(this.searchTerm);

            // broadcast so if searc is open also the serach is updated
            this.broadcast.broadcastMessage('fts.search', this.searchTerm);
        }
    }

    private clearSearchTerm() {
        // cancel any ongoing search
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

        // clear the serachterm
        this.searchTerm = '';
        this.searchTermUntrimmed = '';
        this.fts.searchTerm = '';
    }

    private search(_e) {
        // make sur ethe popup is open
        this.showRecent = true;

        // handle the key pressed
        switch (_e.key) {
            case 'ArrowDown':
            case 'ArrowUp':
                break;
            case 'Enter':
                this.searchTerm = this.searchTermUntrimmed.trim();
                if (this.searchTerm.length) {
                    if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);

                    // set the searchterm .. the timeout might not have gotten it
                    this.fts.searchTerm = this.searchTerm;

                    // broadcast the searchterm
                    this.broadcast.broadcastMessage('fts.search', this.searchTerm);

                    // navigate tot he search view
                    this.router.navigate(['/search']);
                    this.popup.close();
                }
                break;
            default:
                if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
                this.searchTimeOut = window.setTimeout(() => this.doSearch(), 1000);
                break;
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopup()
        }
    }
}
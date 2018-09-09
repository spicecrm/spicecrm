import {
    Component, ElementRef, ViewChild, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {footer} from '../../services/footer.service';
import { language } from "../../services/language.service";
import { modal } from '../../services/modal.service';

@Component({
    selector: 'object-page-header-tags',
    templateUrl: './src/objectcomponents/templates/objectpageheadertags.html',
    styles: [
        '.badgeListContainer { overflow-y: hidden; margin-bottom: -0.125rem; }',
        'ul { line-height: 1.7; }',
        'li { margin-bottom: 0.125rem; }',
        '.badgeListContainer.open { overflow-y: visible; height: auto !important; }',
        '.slds-badge { text-transform: none; font-size: 0.75rem; padding-top: 0.1875rem; line-height: 2.333; }', // 0.75rem == slds-text-body_small
    ]
})
export class ObjectPageHeaderTags {

    @ViewChild('badgeList') badgeList: ElementRef;
    @ViewChild('badgeListContainer') badgeListContainer: ElementRef;

    listIsExpanded = false;
    tags = [ ' ' ];

    heightOfBadge: number = null;

    constructor( private model: model, private metadata: metadata, private footer: footer, private cd: ChangeDetectorRef, private language: language, private modalservice: modal )  {    }

    ngOnInit() {
        if ( this.model.isLoading )
            this.model.data$.subscribe( () => { this.parseTags(); } );
        else
            this.parseTags();
    }

    ngAfterViewChecked() {
        if ( this.heightOfBadge === null && this.badgeList && this.badgeList.nativeElement && this.badgeList.nativeElement.children[0] ) {
            this.heightOfBadge = this.getHeightOfBadge();
            this.badgeListContainer.nativeElement.style.height = this.heightOfBadge + 'px';
            // if ( !this.model.isLoading ) this.parseTags();
            this.cd.detectChanges();
        }
    }

    get taggingEnabled() {
        return this.metadata.checkTagging( this.model.module );
    }

    parseTags() {
        if( !this.model.data.tags || this.model.data.tags === '' ) this.tags = [];
        else {
            try {
                this.tags = JSON.parse( this.model.data.tags );
            } catch( e ) {
                this.tags = [];
            }
        }
    }

    get listIsExpandable() {
        if ( this.heightOfBadge !== null )
            return this.heightOfBadge !== this.getHeightOfBadgeList();
        else return false;
    }

    editTags(){
        this.modalservice.openModal('ObjectPageHeaderTagPicker').subscribe(cmp => {
            cmp.instance.model = this.model;
        });
        this.listIsExpanded = false;
    }

    getHeightOfBadge() {
        return Number( getComputedStyle( this.badgeList.nativeElement.children[0], null ).height.replace( /px$/, '' ))
            + Number( getComputedStyle( this.badgeList.nativeElement.children[0], null ).marginBottom.replace( /px$/, '' ));
    }

    getHeightOfBadgeList() {
        return Number( getComputedStyle( this.badgeList.nativeElement, null ).height.replace( /px$/, '' ));
    }

}
/**
 * @module ModuleMediaFiles
 */
import { Component, OnInit } from '@angular/core';
import {mediafiles} from '../../../services/mediafiles.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';
import {Subject, Observable} from 'rxjs';
import { toast } from '../../../services/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import { userpreferences } from '../../../services/userpreferences.service';

declare var _: any;

@Component({
    selector: 'media-file-picker',
    templateUrl: './src/modules/mediafiles/templates/mediafilepicker.html',
    providers: [ mediafiles ],
    styles: [ 'img.thumb { background-color: #fff; border: 1px solid #d8dde6; padding: 1px; margin-right: 3px; width: 32px; height: 32px; }',
        'li { display: inline-block; vertical-align: middle; border-radius: .25rem; width: 160px; height: 160px;  box-sizing: content-box; position: relative;  }',
        'ul { margin: 0 -.75rem -.75rem 0; }',
        'a { display: block; height: 100%; width: 100%; padding: .25rem; border: 1px solid #dddbda; }',
        'a:hover { border: 1px solid #1589ee; filter: brightness(92%); }',
        'a:hover media-file-image { filter: brightness(118%); }',
        'span.fileinfos { display:none;position:absolute; bottom:-5px; left:-6px; right:-6px; bottom:-6px; background-color:#eee; padding:5px; border: 1px solid #1589ee; }',
        'a:hover span.fileinfos, a:focus span.fileinfos { display:block;filter:brightness(108.7%); }',
        'span.fileinfos span.name { display:block; }'
    ]
})
export class MediaFilePicker implements OnInit {

    private pickerIsLoading = true;
    private files: any[] = [];

    private selectedCategoryID = '';
    private selectedCategory: object;

    private dropdownUnused = true;

    private categoriesLoaded = false;
    private filesLoaded = false;

    private mediatype = 1;
    private filetype = '';

    private answer: Observable<object> = null;
    private answerSubject: Subject<object> = null;

    private uploadAllowed = false;

    private self: any;

    private fileformats = {
        gif: { name: 'GIF', format: 'gif', checked: true },
        jpeg: { name: 'JPEG', format: 'png', checked: true },
        png: { name: 'PNG', format: 'jpeg', checked: true },
    };
    private fileformatList: any[];

    private compId: string;

    private _sortBy = 'name';
    private _sortDirection = 'a';

    private _filterTags = '';

    constructor( private mediafiles: mediafiles, private backend: backend, private language: language, private toast: toast, private sanitizer: DomSanitizer, private prefservice: userpreferences ) {
        this.answerSubject = new Subject<object>();
        this.answer = this.answerSubject.asObservable();
        this.compId = _.uniqueId();
        this.fileformatList =  _.values( this.fileformats );
    }

    public ngOnInit(): void {

        this.mediafiles.loadCategories().subscribe( () => {
            this.categoriesLoaded = true;
            if ( this.filesLoaded ) this.pickerIsLoading = false;
        });

        let paramsFiles = {
            fields: [ 'id', 'name', 'mediacategory_id', 'thumbnail', 'filetype', 'filesize', 'date_entered', 'width', 'height' ],
            searchfields: { join: 'AND',
                conditions:[
                    { field: 'mediatype', operator: '=', value: this.mediatype }
                ]
            },
            sortfield: 'name',
            limit: -99
        };

        this.backend.getRequest( 'module/MediaFiles', paramsFiles ).subscribe( ( response: any ) => {
                this.files = response.list;
                this.files.forEach( file => {
                    file.name = file.name;
                    file.filesize = parseInt( '0'+file.filesize, 10 ); // The backend delivers the field filesize as string, we need it as number (for sorting).
                    file.filesize_display = Math.ceil( file.filesize / 1024 );
                    file.date_entered_display = this.prefservice.formatDateTime( file.date_entered );
                    file.pixelsize = parseInt( '0'+file.filesize, 10 ) * parseInt( '0'+file.height, 10 );
                });
                this.sortList(); // Sort the list by name, ascending.
                this.filesLoaded = true;
                if ( this.categoriesLoaded ) this.pickerIsLoading = false;
            },
            error => {
                this.toast.sendToast( this.language.getLabel('ERR_NETWORK_LOADING'),'error', 'To retry: Close and reopen the window.', false );
            }
        );

    }

    public set filterTags( value ) {
        this._filterTags = value;
    }

    set sortBy( byField: string ) {
        if ( this._sortBy !== byField ) this.sortList( byField );
        this._sortBy = byField;
    }

    get sortBy(): string {
        return this._sortBy;
    }

    get sortDirection(): string {
        return this._sortDirection;
    }

    set sortDirection( direction: string ) {
        if ( this._sortDirection !== direction ) this.sortList( this._sortBy, direction );
        this._sortDirection = direction;
    }

    private sortList( byField = 'name', direction = 'a' ): void {
        switch( byField ) {
            case 'name':
                this.language.sortObjects( this.files, 'name', direction === 'd' );
                break;
            case 'filesize':
                this.files.sort( ( a, b ) => {
                    return a.filesize > b.filesize ? (direction === 'a' ? 1 : -1) : (direction === 'a' ? -1 : 1);
                });
                break;
                case 'pixelsize':
                this.files.sort( ( a, b ) => {
                    return a.pixelsize > b.pixelsize ? (direction === 'a' ? 1 : -1) : (direction === 'a' ? -1 : 1);
                });
                break;
            case 'date_entered':
                this.files.sort( ( a, b ) => {
                    return a.date_entered > b.date_entered ? (direction === 'a' ? 1 : -1) : (direction === 'a' ? -1 : 1);
                });
                break;
        }
    }

    private pick( index: number ): void {
        this.answerSubject.next( { id: this.files[index].id } );
        this.answerSubject.complete();
        this.self.destroy();
    }

    private cancel(): void {
        this.answerSubject.next( {} );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX(): void {
        this.cancel();
    }

    private changeToUploadDialog(): void {
        this.answerSubject.next( { upload: true } );
        this.answerSubject.complete();
        this.self.destroy();
    }

    private onChangeCategory( event: any ): void {
        this.selectedCategoryID = event.target.value;
        this.selectedCategory = this.mediafiles.categories[this.selectedCategoryID];
        this.dropdownUnused = false;
    }

}

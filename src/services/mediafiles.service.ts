/**
 * @module services
 */
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {footer} from './footer.service';
import {metadata} from './metadata.service';
import { toast } from './toast.service';
import { language } from './language.service';
import { modal } from './modal.service';

@Injectable()
export class mediafiles {

    categoriesLoaded: boolean = false;
    categories: object = {};
    categoriesSorted = [];

    constructor(
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private backend: backend,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
        private footer: footer,
        private toast: toast,
        private language: language,
        private modalservice: modal,
    ) { }

    private storeEtag( id, etag ) {
        if ( !sessionStorage.mediaFileEtags ) sessionStorage.mediaFileEtags = {};
        //sessionStorage.mediaFileEtags[id] = etag;
    }

    private getEtag( id ) {
        if ( sessionStorage.mediaFileEtags && sessionStorage.mediaFileEtags[id] ) return sessionStorage.mediaFileEtags[id];
        else return '';
    }

    // If-None-Match
    private _getImage( mediaId: string, variant: string = '' ) {
        let responseSubject = new Subject<any>(); // this.getEtag(mediaId)
        //{ 'If-None-Match': '1234567890'  }
        this.backend.getRawRequest('module/MediaFiles/'+mediaId+'/file'+(variant != '' ? '/':'' )+variant, {}, null,{} ).subscribe( (response : any) => {
            //this.storeEtag( mediaId,'abc12345' );
            let objectUrl = URL.createObjectURL(response);
            responseSubject.next( this.sanitizer.bypassSecurityTrustUrl( objectUrl ));
            responseSubject.complete();
        });
        return responseSubject.asObservable();
    }
    getImageVariant( mediaId: string, variant: string ) {
        return this._getImage( mediaId, variant );
    }
    getImage( mediaId: string ){
        return this._getImage( mediaId );
    }
    getImageThumb( mediaId: string, size: number ) {
        return this._getImage( mediaId, 'th/'+size );
    }
    getImageSquare( mediaId: string, size: number ) {
        return this._getImage( mediaId, 'sq/'+size );
    }

    uploadFile( files ): Observable<any> {

        if ( files.length === 0 ) return;

        let retSub = new Subject<any>();

        var data = new FormData();
        data.append('file', files[0], files[0].name);

        var request = new XMLHttpRequest();
        let resp: any = {};

        request.onreadystatechange = function ( scope: any = this ) {
            if ( request.readyState == 4 ) {
                try {
                    let retVal = JSON.parse(request.response);
                    retSub.next( {filedata: retVal} );
                    retSub.complete();
                } catch (e) {
                    resp = {
                        status: 'error',
                        data: 'Unknown error occurred: [' + request.responseText + ']'
                    };
                }
            }
        };

        request.upload.addEventListener( 'progress', function ( e: any ) {
            retSub.next({ progress: { total: e.total, loaded: e.loaded }});
            // console.log('progress' + e.loaded + '/' + e.total + '=' + Math.ceil(e.loaded/e.total) * 100 + '%');
        }, false);

        request.open( 'POST', this.configurationService.getBackendUrl() + '/module/MediaFiles/fileupload', true );
        request.setRequestHeader('OAuth-Token', this.session.authData.sessionId );
        request.send( data );

        return retSub.asObservable();
    }

    getMediaFile( mediatype: number, filetype: string, noImagePicker = false, noMetaData = false, category: string ): Observable<any> {

        let retSubject = new Subject();
        if ( noImagePicker ) {
            this.uploadMediaFile( [], noMetaData, category ).subscribe( ( answer ) => {
                if( answer ) {
                    retSubject.next( answer );
                    retSubject.complete();
                }
            } );
        } else {
            this.pickMediaFile( mediatype, filetype ).subscribe( ( answer ) => {
                if( answer.id ) {
                    retSubject.next( answer.id );
                    retSubject.complete();
                } else if( answer.upload === true ) {
                    this.uploadMediaFile( [], noMetaData, category ).subscribe( ( answer ) => {
                        if( answer ) {
                            retSubject.next( answer );
                            retSubject.complete();
                        }
                    } );
                }
            } );
        }
        return retSubject.asObservable();
    }

    pickMediaFile( mediatype: number, filetype: string ): Observable<any> {
        let retSubject = new Subject();
        this.modalservice.openModal('MediaFilePicker').subscribe(picker => {
            picker.instance['mediatype'] = mediatype;
            picker.instance['filetype'] = filetype;
            picker.instance['answer'].subscribe( answer => {
                retSubject.next(answer); // return the answer
                retSubject.complete();
            });
        });
        return retSubject.asObservable();
    }

    // todo: acceptFileTypes
    uploadMediaFile( acceptFileTypes: Array<string>, noMetaData = false, category: string ): Observable<any> {
        let retSubject = new Subject();
        this.modalservice.openModal('MediaFileUploader').subscribe(uploader => {
            uploader.instance['acceptFileTypes'] = acceptFileTypes;
            uploader.instance['noMetaData'] = noMetaData;
            uploader.instance['category'] = category;
            uploader.instance['answer'].subscribe( answer => {
                retSubject.next( answer ); // return the answer
                retSubject.complete();
            });
        });
        return retSubject.asObservable();
    }

    /* Code for Media Categories */

    private makeFullName( category: any ) {
        if ( category.parent === null ) return ( category.fullName = category.name );
        else return ( category.fullName = this.makeFullName( category.parent ) + ' > ' + category.name );
    }

    private setFullName( category: any ) {
        if ( category.fullName ) return;
        else category.fullName = this.makeFullName( category );
    }

    loadCategories() {

        let responseSubject = new Subject();

        if ( this.categoriesLoaded ) {
            setTimeout( ()=>{ responseSubject.next(); responseSubject.complete(); }, 1 );
            return responseSubject;
        }

        let paramsCategories = {
            fields: JSON.stringify( ['id', 'name', 'parent_id'] ),
            sortfield: 'name',
            limit: -99
        };

        this.backend.getRequest( '/module/MediaCategories', paramsCategories ).subscribe( ( response: any ) => {
            for ( let c of response.list ) {
                this.categories[c.id] = c;
                this.categoriesSorted.push( c );
            }
            for ( let c in this.categories )
                this.categories[c].parent = ( this.categories[c].parent_id && this.categories[c].parent_id != '' ) ? this.categories[this.categories[c].parent_id] : null;
            for ( let c in this.categories )
                this.setFullName( this.categories[c] );
            this.categoriesSorted.sort( ( a, b ) => {
                return a.fullName.localeCompare( b.fullName ); // return ( a.fullName > b.fullName ) ? 1 : (( b.fullName > a.fullName ) ? -1 : 0 );
            });
            this.categoriesLoaded = true;
            responseSubject.next();
            responseSubject.complete();
        }, error => {
            this.toast.sendToast( this.language.getLabel('ERR_NETWORK_LOADING'),'error', 'To retry: Close and reopen the window.', false );
        } );

        return responseSubject.asObservable();

    }

    public fileIsInCategory( needleID: string, category: any ) {
        if ( !this.categoriesLoaded || !needleID || needleID == '' || !category ) return false;
        if ( !this.categories[needleID] ) return false;
        if ( needleID === category.id ) return true;
        else return this.isChild( category, this.categories[needleID] );
    }

    private isChild( possibleParent, possibleChild ) {
        if ( !possibleChild.parent ) return false;
        if ( possibleParent.id === possibleChild.parent_id ) return true;
        else return this.isChild( possibleParent, possibleChild.parent );
    }

}

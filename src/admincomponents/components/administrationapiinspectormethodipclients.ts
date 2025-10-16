import { Component, DestroyRef, EventEmitter, inject, Injector, OnInit, Output } from '@angular/core';
import {backend} from '../../services/backend.service';
import { take } from 'rxjs/operators';
import { toast } from '../../services/toast.service';
import { modal } from '../../services/modal.service';
import { Observable, Subject } from 'rxjs';
import { language } from '../../services/language.service';

@Component({
    selector: 'administration-api-inspector-method-ipclients',
    templateUrl: '../templates/administrationapiinspectormethodipclients.html',
    standalone: false
})

export class AdministrationApiInspectorMethodIpClients implements OnInit {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * Indicator of current traffic to the backend.
     */
    public hasTraffic = false;

    /**
     * Object with several data to the affected route.
     */
    public apiRoute: any;

    /**
     * Number hard-coded IP clients for the affected route.
     */
    public numberOfFixDefined: number;

    /**
     * List of IP clients for the affected route.
     */
    public clients: any[] = [];

    /**
     * Data backup of the client list.
     */
    public backup: any[] = [];

    /**
     * Indicator for changed data.
     */
    public isDirty = false;

    /**
     * Indicator for changed data.
     */
    public isOrWasDirty = false;

    /**
     * Indicator for changed IP clients.
     */
    public clientsChanged = false;

    /**
     * Config for the AdministrationConfigurator
     */
    public adminComponentConfig: any;

    /**
     * GUID for the AdministrationConfigurator
     */
    public adminComponentId: string;

    constructor( public backend: backend, public toast: toast, private modal: modal, public injector: Injector, public language: language ) { }

    /**
     * calculate the proper height for the table
     */
    public ngOnInit(): void
    {
        this.loadIpClients();
    }

    /**
     * Load the full list of IP clients from the backend (from the table sysipclients and also hard-coded clients).
     */
    public loadIpClients(): void
    {
        this.hasTraffic = true;
        this.backend.getRequest('admin/ipclients', { routePattern: this.apiRoute.route, routeMethod: this.apiRoute.method})
            .pipe(take(1))
            .subscribe({
                next: response => {
                    response.ip_enabled;
                    this.hasTraffic = false;
                    this.clients = response.clients;
                    this.numberOfFixDefined = response.numberOfFixDefined;
                    this.backup = JSON.parse( JSON.stringify( this.clients ));
                    this.adminComponentConfig = JSON.parse( response.adminComponent.componentconfig );
                    this.adminComponentId = response.adminComponent.id;
                },
                error: error => {
                    this.toast.sendToast('Error loading IP Clients.','error');
                    this.hasTraffic = false;
                }
            });

    }

    /**
     * Save button clicked.
     */
    public buttonSave()
    {
        this.save().subscribe({ next: ( success) => {
                if ( success) this.close();
            }});
    }

    /**
     * Save the list of to the route assigned IP clients.
     */
    public save(): Observable<boolean>
    {
        let responseSubject = new Subject<boolean>();
        this.hasTraffic = true;
        this.backend.postRequest('admin/ipclients', null, { routePattern: this.apiRoute.route, routeMethod: this.apiRoute.method, clients: this.clients })
            .pipe(take(1))
            .subscribe({
                next: response => {
                    this.hasTraffic = false;
                    if ( response.success === true ) {
                        this.toast.sendToast('LBL_DATA_SAVED', 'success');
                        this.isDirty = this.isOrWasDirty = false;
                        this.clients = response.clients;
                        this.numberOfFixDefined = response.numberOfFixDefined;
                        this.backup = JSON.parse( JSON.stringify( this.clients ));
                        responseSubject.next(true);
                    }
                    responseSubject.next(false);
                },
                error: error => {
                    this.toast.sendToast( error.error.error.message, 'error');
                    this.hasTraffic = false;
                    responseSubject.next(false);
                }
            });
        return responseSubject.asObservable();
    }

    /**
     * Escape pressed or [x] clicked.
     */
    public onModalEscX(): boolean
    {
        if ( this.isDirty ) {
            this.modal.confirm( this.language.getLabel('QST_CLOSE_WINDOW_UNSAVED_DATA', null, 'long'), this.language.getLabel('QST_CLOSE_WINDOW_UNSAVED_DATA')).subscribe( answer => {
                if ( answer ) this.close();
            });
            return false;
        }
        this.close();
    }

    /**
     * Close the modal.
     */
    public close(): void
    {
        this.self.destroy();
    }

    /**
     * Determine the dirty indicator.
     */
    public setDirty(): void
    {
        this.isDirty = this.clients.some( ( client, i ) => client.access !== this.backup[i].access );
        if ( this.isDirty ) this.isOrWasDirty = true;
    }

    /**
     * Button clicked to open the Client Definition.
     */
    public buttonDefineClients(): void
    {
        if ( this.isDirty ) {
            this.modal.confirm( "Save changes?", 'Changed Data' ).subscribe( answer => {
                if ( answer ) {
                    this.save().subscribe({ next: ( success ) => {
                            if ( success ) this.defineClients();
                        }});
                }
            } );
        } else this.defineClients();
    }

    /**
     * For adding/changing IP clients open a modal for the component AdministrationConfigurator
     */
    public defineClients(): void
    {
        this.clientsChanged = false;
        this.modal.openModal('AdministrationIpClients', true, this.injector ).subscribe( modalRef => {
            modalRef.instance.adminComponentConfig = this.adminComponentConfig;
            modalRef.instance.adminComponentId = this.adminComponentId;
            modalRef.instance.changed.subscribe( () => this.clientsChanged = true );
            modalRef.instance.closed.subscribe( () => {
                if ( this.clientsChanged ) this.loadIpClients();
            });
        });
    }

}

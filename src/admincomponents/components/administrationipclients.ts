import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { backend } from '../../services/backend.service';
import { toast } from '../../services/toast.service';
import { modal } from '../../services/modal.service';
import { administration } from '../services/administration.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'administration-ipclients',
    templateUrl: '../templates/administrationipclients.html',
    providers: [administration],
    standalone: false
})

export class AdministrationIpClients implements OnInit {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * The Component Config for the Aministration Configurator
     */
    @Input() public adminComponentConfig: any;

    /**
     * The GUID of the config item in the DB table 'sysuiadmincomponents'
     */
    @Input() public adminComponentId: string;

    public closable = true;

    public changed = new EventEmitter();
    public closed = new EventEmitter();

    constructor( public backend: backend, public toast: toast, private modal: modal, public administration: administration, public language: language ) { }

    public ngOnInit(): void {
        this.administration.opened_itemid = this.adminComponentId;
    }

    // Escape pressed or [x] clicked.
    public onModalEscX(): boolean
    {
        if ( !this.closable ) {
            this.modal.confirm( this.language.getLabel('QST_CLOSE_WINDOW_UNSAVED_DATA', null, 'long'), this.language.getLabel('QST_CLOSE_WINDOW_UNSAVED_DATA')).subscribe( answer => {
                if ( answer ) this.close();
            });
            return false;
        } else this.close();
    }

    public close(): void
    {
        this.closed.emit();
        this.self.destroy();
    }

    public dataChanged(): void
    {
        this.changed.emit();
    }

}

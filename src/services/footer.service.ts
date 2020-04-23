/**
 * @module services
 */
import {Injectable} from '@angular/core';

@Injectable()
export class footer {

    /**
     * elementref to the footer container
     */
    public footercontainer: any = null;

    /**
     * elemen ref to the client container
     */
    public modalcontainer: any = null;

    /**
     * reference to the modal backdrop container
     */
    public modalbackdrop: any = null;

    /**
     * a height of a footer to be reserved
     */
    public visibleFooterHeight: number = 0;
}

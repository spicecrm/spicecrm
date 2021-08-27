/**
 * @module services
 */
import {Injectable} from "@angular/core";


/**
 * this is a very simple Helper Service that handles the modalwindow and is provided as part of a modal. This allows that actions can access the modal objet and also close the modal objet
 */
@Injectable()
export class modalwindow {

    /**
     * the reference to self as the modal window
     */
    public self: any;

}

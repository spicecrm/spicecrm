/**
 * @module services
 */
import {Injectable} from "@angular/core";

/**
 * @ignore
 */
declare var _: any;

/**
 * The service "modelregister" prevents the unwanted closing of browser windows/tabs if data entered/changed has not yet been saved.
 * It holds an array of all existing models. Then, when a browser window or tab should get closed, all those models can be asked if there is unsaved data and the window/tab should not get closed.
 */
@Injectable()
export class modelregister {

    /**
     * The array where all existing models are registered.
     */
    public register: any[] = [];

    /**
     * A counter to give every registered model a unique id.
     * This id is needed to unregister a model.
     */
    private counter = 0;

    constructor() {

        // setTimeout is a workaround, in simple js applications without angular it works without it.
        window.setTimeout( () => {
            addEventListener( 'beforeunload', ( e: BeforeUnloadEvent ) => {
                if ( this.anyDirtyModel() ) {
                    e.preventDefault();
                    e.returnValue = '';
                }
            } );
        }, 1 );

    }

    /**
     * Register a model.
     * @param model The model.
     * @return Model id.
     */
    public registerModel( model ): number {
        let id = ++this.counter;
        this.register.push({ id: id, model: model });
        return id;
    }

    /**
     * Unregister a model.
     * @param id The model id.
     */
    public unregisterModel( id: number ): void {
        this.register.some( ( model, i ) => {
           if ( model.id === id ) {
               this.register.splice( i, 1 );
               return true;
           }
        });
    }

    /**
     * Checks if there is any model with dirty fields (unsaved).
     */
    private anyDirtyModel(): boolean {
        if ( this.register.some( model => {
           if ( model.model.isEditing && _.values( model.model.getDirtyFields() ).length ) {
               console.info('Warning to prevent closing of window/tab. Dirty Model: ' + model.model.module + ', ' + model.model.id );
               return true;
           }
        })) {
            return true;
        }
    }

}

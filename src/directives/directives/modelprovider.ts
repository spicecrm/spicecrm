import {Directive, Input, OnInit} from '@angular/core';
import {model} from "../../services/model.service";



/**
 * a directive that does nothing else but to provide a model service instance, populated by an model like object
 * author: sebastian franz
 */
@Directive({
    selector: '[modelProvider]',
    providers: [model]
})
export class ModelProviderDirective
{
    /*
    @Input('modelProvider') provided_model:{
        module:string,
        id:string,
        data:any,
    };
    */

    constructor(
        private model:model
    ){
        // in case the host component is listening to the loading status and waits for it!
        this.model.isLoading = true;
        //console.log('model is loading...');
    }

    @Input('modelProvider')
    set provided_model(provided_model:{module:string, id:string, data:any})
    {
        this.model.module = provided_model.module;
        if( provided_model.id )
        {
            this.model.id = provided_model.id;
        }
        else if( provided_model.data )
        {
            this.model.id = provided_model.data.id;
        }

        if( provided_model.data )
        {
            this.model.data = provided_model.data;
            this.model.isLoading = false;
            this.model.data$.emit();
        }
        else if( this.model.id )
        {
            // if no data was found BUT an ID, load it from backend... isLoading will be set inside getData()
            this.model.getData();
        }
        // has to be called again after the data is set because of the missing acl before...
        this.model.initializeFieldsStati();
    }


}
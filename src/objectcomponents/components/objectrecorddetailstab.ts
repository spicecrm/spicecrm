/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details-tab',
    templateUrl: './app/objectcomponents/templates/objectrecorddetailstab.html'
})
export class ObjectRecordDetailsTab implements OnInit{

    componentconfig: any = {};
    expanded: boolean = true;

    constructor(private activatedRoute: ActivatedRoute, private metadata: metadata, private model: model, private language: language) {}

    ngOnInit(){
        if(this.componentconfig.collapsed){
            this.expanded = false;
        }
    }

    get fieldSet(){
        try {
            return this.componentconfig['fieldset'];
        } catch(e){
            return '';
        }
    }

    get showTitle(){
        try {
            return !this.componentconfig['hidelabel'];
        } catch(e){
            return false;
        }
    }

    get hidden()
    {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate) );
    }

    getFieldsets(){
        return this.metadata.getFieldSetFields(this.componentconfig['fieldset']);
    }

    togglePanel(){
        this.expanded = !this.expanded;
    }

    getChevronStyle(){
        if(!this.expanded)
            return{
                'transform': 'rotate(45deg)',
                'margin-top' : '4px'
            }
    }

    getTabStyle(){
        if(!this.expanded)
                return {
                    height: '0px',
                    transform: 'rotateX(90deg)'
                }
    }
    getContainerStyle(){
            return{
                // 'overflow': 'hidden'
            }
    }
}
/**
 * @module ObjectFields
 */
import {AfterViewInit, Component, Input,  ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'field-wysiwyg-editor',
    templateUrl: '../templates/fieldwysiwygeditor.html',
})
export class fieldWYSIWYGEditor implements AfterViewInit{
    @ViewChild('editor', {read: ViewContainerRef, static: true}) editor: ViewContainerRef;
    @Input() fieldname: string = '';
    fieldSelection: any = undefined;

    constructor(public model: model, public view: view, public language: language, ) {

    }

    get fieldcontent(){

        /*
        if(this.fieldSelection){
            var range = document.createRange();
            range.setStart(this.editor.element.nativeElement.firstChild, 6);
            range.setEnd(this.editor.element.nativeElement.firstChild, 8);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
*/
        return this.model.data[this.fieldname];

    }

    ngAfterViewInit(){
        this.editor.element.nativeElement.innerHTML = this.model.data[this.fieldname];
    }

    eventHandler(event){

        // get content caret
        //debugger;
        this.fieldSelection = window.getSelection();
        // todo: replace with this.value...
        this.model.data[this.fieldname] = event.srcElement.innerHTML;
        // console.log(event);
    }

    onBlur(event){
        console.log(event);
    }
}

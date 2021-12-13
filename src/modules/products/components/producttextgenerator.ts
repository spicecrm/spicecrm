/**
 * @module ModuleProducts
 */
import {Component, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'product-text-generator',
    templateUrl: '../templates/producttextgenerator.html'
})
export class ProductTextGenerator {

    public componentSubscriptions: any[] = [];
    public attributes: any = {};
    public ltattributes: any = {};
    public productnames: any[] = [];
    public attributesproductid: string = '';
    public loading: boolean = false;
    public tableguid: string = '';
    public isOpen: boolean = true;
    public E1: string = '';
    public E2: string = '';
    public Q: string = '';

    public textElements = {
        MGST: '',
        E1: '',
        E2: '',
        Q: '',
        F: '',
        A: '',
        S: '',
    };
    public textTemplateDef = [
        {
            source: 'MGST',
            len: 6
        },
        {
            source: 'E1',
            len: 4
        },
        {
            source: 'E2',
            len: 4
        },
        {
            source: 'Q',
            len: 4
        },
        {
            source: 'F',
            len: 4
        },
        {
            source: 'A',
            len: 15
        },
        {
            source: 'S',
            len: 3
        },
    ];
    public textTemplate: string = 'MGST:1:6::E1:7:10::E2:11:14::Q:15:18::F:19:22::A:23:37::S:38:40';

    constructor(public language: language, public backend: backend, public elementRef: ElementRef, public model: model, public view: view) {
        this.componentSubscriptions.push(model.data$.subscribe(event => {
                this.loadAttributes();
            })
        );

        this.tableguid = this.model.generateGuid();
    }

    get e1() {
        return this.textElements.E1;
    }

    set e1(value) {
        this.textElements.E1 = value;
    }

    get productText() {
        let producttext = '';
        for (let textElement of this.textTemplateDef) {
            let element = '';
            switch (textElement.source) {
                case 'E1':
                case 'E2':
                case 'Q':
                    if (this.textElements[textElement.source]) {
                        element = this.getAttributeValue(this.textElements[textElement.source]);

                        // handle specific datatypes
                        switch (this.attributes[this.textElements[textElement.source]].prat_datatype) {
                            case 'N':
                                element = element.toString();
                                while (element.length < 4) {
                                    element = '0' + element;
                                }
                                break;
                            case 'S':
                            case 'D':
                                element = this.translateAttribValue(this.textElements[textElement.source], element);
                                break;
                        }
                    }
                    break;
                case 'F':
                    for (let attrib in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrib) && this.attributes[attrib].contentcode == 'F') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if (this.attributes[attrib].contentcode2 == 'D' && attribvalue) {
                                element = 'DRUC';
                            } else if (attribvalue && element === '') {
                                element = this.translateAttribValue(attrib, attribvalue);
                            }
                        }
                    }
                    break;
                case 'A':
                    let dimAttribs = [];

                    // get all attribs
                    for (let attrib in this.attributes) {
                        if (this.attributes.hasOwnProperty(attrib) && this.attributes[attrib].contentcode == 'A') {
                            let attribvalue = this.getAttributeValue(attrib);
                            if (attribvalue) {
                                switch (this.attributes[attrib].prat_datatype) {
                                    case 'N':
                                        attribvalue = attribvalue.toString();
                                        while (attribvalue.length < 4) {
                                            attribvalue = '0' + attribvalue;
                                        }
                                        break;
                                    case 'S':
                                    case 'D':
                                        attribvalue = this.translateAttribValue(attrib, attribvalue);
                                        break;
                                }
                                dimAttribs.push({
                                    position: this.attributes[attrib].contentcode2,
                                    value: (this.attributes[attrib].contentprefix ? this.attributes[attrib].contentprefix : '') + attribvalue
                                });
                            }
                        }
                    }

                    // sort the attribs by sequence
                    dimAttribs.sort((a, b) => {
                        return a.position > b.position ? 1 : -1;
                    });

                    // buiol the text element
                    for (let attrib of dimAttribs) {
                        element += attrib.value;
                    }

                    break;
                default:
                    element = this.textElements[textElement.source];
                    break;
            }

            // fill value up with slashes
            if (element.length == textElement.len) {
                producttext += element;
            } else if (element.length > textElement.len) {
                producttext += element.substr(0, textElement.len);
            } else {
                while (element.length < textElement.len) {
                    element += '/';
                }
                producttext += element;
            }

        }

        return producttext;
    }

    get longText() {
        let longtext = '';

        for (let attrib of this.ltattributes) {
            let attribvalue = this.getAttributeValue(attrib.id);
            if (attribvalue != '') {
                longtext += attrib.textpattern.replace('[value]', attribvalue) + '\n';
            }
        }

        return longtext;
    }

    public ngOnInit() {
        this.loadAttributes();
    }

    public ngOnDestroy() {
        for (let subscription of this.componentSubscriptions) {
            subscription.unsubscribe();
        }
    }

    public loadAttributes() {
        if (this.model.data.product_id && this.model.data.product_id !== this.attributesproductid) {
            this.loading = true;
            this.attributesproductid = this.model.data.product_id;
            this.backend.getRequest('module/Products/' + this.model.data.product_id + '/ProductAttributes/textgenerator').subscribe((response: any) => {
                this.attributes = response.attributes;
                this.ltattributes = response.ltattributes;
                this.productnames = response.productnames;
                this.textElements.MGST = response.shorttext.substr(6, 6);
                this.loading = false;
            });
        } else if (!this.model.data.product_id) {
            this.attributes = [];
        }
    }

    public translateAttribValue(attrib, value) {
        if (this.attributes[attrib].values && this.attributes[attrib].values[value]) {
            return this.attributes[attrib].values[value];
        } else {
            return value;
        }
    }

    public togglerequired() {
        this.isOpen = !this.isOpen;
    }

    public getOpenStyle() {
        if (!this.isOpen) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    public getAttributeValue(attributeid) {
        let value = '';
        let beans = this.model.data.productattributevalues.beans;
        try {
            for (let attrib in beans) {
                if (beans.hasOwnProperty(attrib) && beans[attrib].productattribute_id == attributeid) {
                    return beans[attrib].pratvalue;
                }
            }
        } catch (e) {
            return '';
        }

        return value;
    }

    public getvalues(type) {
        let values = [];

        for (let attribute in this.attributes) {
            if (this.attributes.hasOwnProperty(attribute) && this.attributes[attribute].contentcode == type) {
                values.push({
                    id: this.attributes[attribute].id,
                    name: this.attributes[attribute].name
                });
            }
        }

        return values;
    }
}

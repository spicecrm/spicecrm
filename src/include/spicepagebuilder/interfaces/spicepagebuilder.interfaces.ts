/**
 * container element to be rendered in the view
 */
export interface TagElementI {
    tagName: string;
    attributes: any;
    children: any[];
}
/**
 * body element that will be rendered in the view
 * More details: https://mjml.io/documentation/#mj-body
 */
export interface BodyI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'width'?: string,
        'css-class'?: string
    };
}
/**
 * section element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-section
 */
export interface SectionI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'background-repeat'?: string,
        'background-size'?: string,
        'background-url'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'padding'?: string,
        'css-class'?: string,
        'direction'?: string,
        'full-width'?: string,
        'text-align'?: string
    };
}
/**
 * column element to be rendered in the view
 * More details: https://mjml.io/documentation/#mj-column
 */
export interface ColumnI extends TagElementI {
    attributes: {
        'background-color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'width'?: string,
        'vertical-align'?: string,
        'padding'?: string,
        'css-class'?: string
    };
}
/**
 * content element to be rendered in the view
 */
export interface ContentElementI {
    label: string,
    tagName: string;
    attributes: any;
}
/**
 * divider element to be rendered in the view
 */
export interface DividerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'border-color'?: string,
        'border-style'?: string,
        'border-width'?: string,
        'padding'?: string,
        'css-class'?: string,
        'width'?: string
    };
}
/**
 * button element to be rendered in the view
 */
export interface ButtonI extends ContentElementI {
    content: string;
    attributes: {
        'href': string,
        'align': string,
        'background-color'?: string,
        'container-background-color'?: string,
        'color'?: string,
        'border'?: string,
        'border-top'?: string,
        'border-right'?: string,
        'border-bottom'?: string,
        'border-left'?: string,
        'border-radius'?: string,
        'height'?: string,
        'padding'?: string,
        'inner-padding'?: string,
        'text-align'?: string,
        'vertical-align'?: string,
        'css-class'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'letter-spacing'?: string,
        'line-height'?: string,
        'rel'?: string,
        'target'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'width'?: string
    };
}
/**
 * image element to be rendered in the view
 */
export interface ImageI extends ContentElementI {
    attributes: {
        'href?': string,
        'align?': string,
        'alt'?: string,
        'src': string,
        'title'?: string,
        'border'?: string,
        'border-radius'?: string,
        'container-background-color'?: string,
        'height'?: string,
        'padding'?: string,
        'css-class'?: string,
        'fluid-on-mobile'?: 'true'|'false',
        'rel'?: string,
        'srcset'?: string,
        'target'?: string,
        'width'?: string
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface SpacerI extends ContentElementI {
    attributes: {
        'container-background-color'?: string,
        'height': string,
        'padding': string,
        'css-class': string,
        'vertical-align': string,
        'width'?: string
    };
}
/**
 * text element to be rendered in the view
 */
export interface TextI extends ContentElementI {
    content: string;
    attributes: {
        'color'?: string,
        'container-background-color'?: string,
        'font-size'?: string,
        'font-style'?: string,
        'font-weight'?: string,
        'line-height'?: string,
        'letter-spacing'?: string,
        'height'?: string,
        'text-decoration'?: string,
        'text-transform'?: string,
        'align'?: string,
        'padding'?: string,
        'css-class'?: string
    };
}
/**
 * spacer element to be rendered in the view
 */
export interface HTMLCodeI extends ContentElementI {
    content: string;
}
/**
 * available panel element
 */
export interface PanelElementI extends ContentElementI {
    icon: string;
    label: string;
    content?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface EditorAttributeI {
    name: string;
    type: string;
    label?: string;
}
/**
 * spacer element to be rendered in the view
 */
export interface AttributeObjectI {
    name: string;
    type: 'color'|'text'|'sides'|'textSuffix';
}












































































export type DocumentEditorType = 'HTMLFormat' |
    'RichTextFormat' |
    'PlainText' |
    'InternalUnicodeFormat' |
    'MSWord' |
    'AdobePDF' |
    'WordprocessingML' |
    'SpreadsheetML';

/**
 * TextControl paragraph style object with key as the function name and the value to be passed
 * https://docs.textcontrol.com/textcontrol/ds-server/ref.javascript.formattingstyle.object.htm
 */
export interface TxControlParagraphStyleI {
    /**
     * name of the style
     */
    name: string;
    /**
     * attributes definition
     */
    attributes: {
        /**
         * Sets values specifying automatic sub- or superscripted text.
         * Superscript	Text is moved above the baseline.
         * Subscript	Text is moved below the baseline.
         * SuperscriptUpperEdge	Text is scaled und moved above the baseline. The moved text does not extend above the upper edge of capital letters. This can be used for nominators of diagonal fractions.
         * SubscriptBaseline	Text is scaled, but is not moved below the baseline. This can be used for denominators of diagonal fractions.
         * None	Text is scaled, but is not moved below the baseline. This can be used for denominators of diagonal fractions.
         */
        setAutoBaseline?: 'Superscript' | 'Subscript' | 'SuperscriptUpperEdge' | 'SubscriptBaseline' | 'None';
        /**
         * Sets the baseline alignment, in twips, of the style.
         */
        setBaseline?: number;
        /**
         * Sets the bold attribute of the style.
         */
        setBold?: boolean;
        /**
         * Sets values specifying wheather lowercase letters are displayed with capital letters.
         * Capitals	All lowercase letters are displayed with capital letters.
         * SmallCapitals	All lowercase letters are displayed with capital letters which have the size of the lowercase 'x' + 10%.
         * PetiteCapitals	All lowercase letters are displayed with capital letters which have the size of the lowercase 'x'.
         * None	There are no text effects with capital letters.
         */
        setCapitals?: 'Capitals' | 'SmallCapitals' | 'PetiteCapitals' | 'None';
        /**
         * Sets or sets the style's character scaling, in percent of the average character width.
         */
        setCharacterScaling?: number;
        /**
         * Sets the style's character spacing value, in twips.
         */
        setCharacterSpacing?: number;
        /**
         * Sets the font's size of the style.
         */
        setFontSize?: number;
        /**
         * Sets the style's color used to display the text.
         */
        setForeColor?: string;
        /**
         * Sets the italic attribute of the style.
         */
        setItalic?: boolean;
        /**
         * Sets the strikeout attribute of the style.
         */
        setStrikeout?: boolean;
        /**
         * Sets the style's text background color.
         */
        setTextBackColor?: string;
        /**
         * Sets the underlining styles for the style.
         * Capitals	All lowercase letters are displayed with capital letters.
         * SmallCapitals	All lowercase letters are displayed with capital letters which have the size of the lowercase 'x' + 10%.
         * PetiteCapitals	All lowercase letters are displayed with capital letters which have the size of the lowercase 'x'.
         * None	There are no text effects with capital letters.
         */
        setUnderline?: 'DoubledWordsOnly' | 'Doubled' | 'SingleWordsOnly' | 'Single' | 'None';
    }
}
/**
 * @module ModuleQuestionnaires
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {ModuleMediaFiles}      from '../../modules/mediafiles/modulemediafiles';

import /*embed*/ {QuestionsManager} from './components/questionsmanager';
import /*embed*/ {QuestionsManagerEditMulti} from "./components/questionsmanagereditmulti";
import /*embed*/ {QuestionsManagerAddModal} from './components/questionsmanageraddmodal';
import /*embed*/ {QuestionsetTypeParameters} from './components/questionsettypeparameters';
import /*embed*/ {QuestionsetTypeParametersRating} from './components/questionsettypeparametersrating';
import /*embed*/ {QuestionsetTypeParametersText} from './components/questionsettypeparameterstext';
import /*embed*/ {QuestionsManagerEditRating} from './components/questionsmanagereditrating';
import /*embed*/ {QuestionsManagerEditBinary} from "./components/questionsmanagereditbinary";
import /*embed*/ {QuestionsManagerEditBinaryOption} from "./components/questionsmanagereditbinaryoption";
import /*embed*/ {QuestionsManagerEditSingle} from "./components/questionsmanagereditsingle";
import /*embed*/ {QuestionsManagerEditText} from "./components/questionsmanageredittext";
import /*embed*/ {QuestionsManagerEditIst} from "./components/questionsmanagereditist";
import /*embed*/ {QuestionsManagerEditOptionIst} from "./components/questionsmanagereditoptionist";
import /*embed*/ {QuestionsManagerEditOptionSingleMulti} from "./components/questionsmanagereditoptionsinglemulti";
import /*embed*/ {QuestionnairePreviewButton} from './components/questionnairepreviewbutton';
import /*embed*/ {QuestionnairePreview} from './components/questionnairepreview';
import /*embed*/ {QuestionnaireRender} from './components/questionnairerender';
import /*embed*/ {QuestionsetPreviewButton} from './components/questionsetpreviewbutton';
import /*embed*/ {QuestionsetPreview} from './components/questionsetpreview';
import /*embed*/ {QuestionsetRender} from './components/questionsetrender';
import /*embed*/ {QuestionsetRenderRating} from './components/questionsetrenderrating';
import /*embed*/ {QuestionsetRenderText} from './components/questionsetrendertext';
import /*embed*/ {QuestionsetRenderIST, QuestionTypeISTTextPipe, QuestionTypeISTOptionsPipe} from './components/questionsetrenderist';
import /*embed*/ {QuestionsetCategoryPool} from './components/questionsetcategorypool';
import /*embed*/ {QuestionsManagerEditCategories} from './components/questionsmanagereditcategories';
import /*embed*/ {QuestionnaireEvaluation} from './components/questionnaireevaluation';
import /*embed*/ {QuestionnaireEvaluationDefault} from './components/questionnaireevaluationdefault';
import /*embed*/ {QuestionnaireEvaluationBar} from './components/questionnaireevaluationbar';
import /*embed*/ {QuestionnaireEvaluationSpiderweb} from './components/questionnaireevaluationspiderweb';
import /*embed*/ {QuestionnaireInterpretationCategories} from './components/questionnaireinterpretationcategories';
import /*embed*/ {QuestionnaireInterpretationAssignment} from './components/questionnaireinterpretationassignment';
import /*embed*/ {QuestionsetRenderBinarySingleMulti} from './components/questionsetrenderbinarysinglemulti';
import /*emded*/ {QuestionnaireEditor} from './components/questionnaireeditor';
import /*embed*/ { QuestionnaireEditorQuestionsetAdd } from './components/questionnaireeditorquestionsetadd';
import /*embed*/ { QuestionsetManager } from './components/questionsetmanager';
import { DirectivesModule } from '../../directives/directives';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        ModuleMediaFiles,
        DirectivesModule
    ],
    declarations: [
        QuestionsManager,
        QuestionsManagerAddModal,
        QuestionsetTypeParameters,
        QuestionsetTypeParametersRating,
        QuestionsetTypeParametersText,
        QuestionsManagerEditRating,
        QuestionsManagerEditBinary,
        QuestionsManagerEditBinaryOption,
        QuestionsManagerEditSingle,
        QuestionsManagerEditMulti,
        QuestionsManagerEditText,
        QuestionsManagerEditIst,
        QuestionsManagerEditOptionIst,
        QuestionsManagerEditOptionSingleMulti,
        QuestionsetPreviewButton,
        QuestionsetPreview,
        QuestionsetRender,
        QuestionsetRenderIST,
        QuestionsetRenderRating,
        QuestionsetRenderText,
        QuestionsetRenderBinarySingleMulti,
        QuestionTypeISTTextPipe,
        QuestionTypeISTOptionsPipe,
        QuestionnairePreviewButton,
        QuestionnairePreview,
        QuestionnaireRender,
        QuestionsetCategoryPool,
        QuestionsManagerEditCategories,
        QuestionnaireEditor,
        QuestionnaireEditorQuestionsetAdd,
        QuestionsetManager,
        QuestionnaireEvaluation,
        QuestionnaireEvaluationDefault,
        QuestionnaireEvaluationBar,
        QuestionnaireEvaluationSpiderweb,
        QuestionnaireInterpretationCategories,
        QuestionnaireInterpretationAssignment
    ]
})
export class ModuleQuestionnaires {}

import { UIUtils, ReactDataGrid, ReactDataGridColumnLevel, ReactDataGridColumn } from './LibraryImports'

import React from 'react';
import FullWidthSection from './FullWidthSection'
import Widget from './Widget';
import FlexiciousMockGenerator from '../mockdata/FlexiciousMockGenerator.js'
import SystemConstants from '../mockdata/SystemConstants'
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Employee from '../mockdata/Employee.js'

export default class Localization extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const grid = this.grid;
    flexiciousNmsp.Filter.ALL_ITEM = "tous";
    flexiciousNmsp.Constants.MCS_LBL_TITLE_TEXT = "Trier la colonne multi";
    flexiciousNmsp.Constants.MCS_LBL_HEADER_TEXT = "S'il vous plaît spécifier l'ordre de tri et de la direction des colonnes que vous souhaitez trier par:";
    flexiciousNmsp.Constants.MCS_LBL_SORT_BY_TEXT = "Trier par:";
    flexiciousNmsp.Constants.MCS_LBL_THEN_BY_TEXT = "Then par:";
    flexiciousNmsp.Constants.MCS_RBN_ASCENDING_LABEL = "ascendant";
    flexiciousNmsp.Constants.MCS_RBN_DESCENDING_LABEL = "descendant";
    flexiciousNmsp.Constants.MCS_BTN_CLEAR_ALL_LABEL = "effacer tout";
    flexiciousNmsp.Constants.MCS_BTN_APPLY_LABEL = "appliquer";
    flexiciousNmsp.Constants.MCS_BTN_CANCEL_LABEL = "annuler";

    flexiciousNmsp.Constants.SETTINGS_COLUMNS_TO_SHOW = "Colonnes à afficher";
    flexiciousNmsp.Constants.SAVE_SETTINGS_TITLE = "Les préférences que vous définissez ci-dessous sont conservées lors de cette grille est chargé dans l'avenir:";
    flexiciousNmsp.Constants.SAVE_SETTINGS_PREFERENCE_NAME = "Nom de l'option:";
    flexiciousNmsp.Constants.SAVE_SETTINGS_ORDER_OF_COLUMNS = "Ordre des colonnes";
    flexiciousNmsp.Constants.SAVE_SETTINGS_VISIBILITY_OF_COLUMNS = "Visibilité des colonnes";
    flexiciousNmsp.Constants.SAVE_SETTINGS_WIDTHS_OF_COLUMNS = "Largeurs de colonnes";
    flexiciousNmsp.Constants.SAVE_SETTINGS_FILTER_CRITERIA = "Critères de filtrage";
    flexiciousNmsp.Constants.SAVE_SETTINGS_SORT_SETTINGS = "Réglages Trier";
    flexiciousNmsp.Constants.SAVE_SETTINGS_SCROLL_POSITIONS = "positions de défilement";
    flexiciousNmsp.Constants.SAVE_SETTINGS_FILTER_AND_FOOTER_VISIBILITY = "Visiblité filtre et pied de page";
    flexiciousNmsp.Constants.SAVE_SETTINGS_RECORDS_PER_PAGE = "Enregistrements par page";
    flexiciousNmsp.Constants.SAVE_SETTINGS_PRINT_SETTINGS = "Paramètres d'impression";
    flexiciousNmsp.Constants.SAVE_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES = "Supprimer toutes les préférences sauvegardées";
    flexiciousNmsp.Constants.SAVE_SETTINGS_CLEAR_SAVED_PREFERENCES = "Claires Préférences sauvegardées";
    flexiciousNmsp.Constants.SAVE_SETTINGS_SAVE_PREFERENCES = "Enregistrer les préférences";
    flexiciousNmsp.Constants.SAVE_SETTINGS_CANCEL = "annuler";

    flexiciousNmsp.Constants.SETTINGS_COLUMNS_TO_SHOW = "Colonnes à afficher";
    flexiciousNmsp.Constants.SETTINGS_SHOW_FOOTERS = "montrer pieds de page";
    flexiciousNmsp.Constants.SETTINGS_SHOW_FILTER = "Filtrer";
    flexiciousNmsp.Constants.SETTINGS_RECORDS_PER_PAGE = "Enregistrements par page";
    flexiciousNmsp.Constants.SETTINGS_APPLY = "Appliquer";
    flexiciousNmsp.Constants.SETTINGS_CANCEL = "Annuler";

    flexiciousNmsp.Constants.OPEN_SETTINGS_DEFAULT = "Par défaut?";
    flexiciousNmsp.Constants.OPEN_SETTINGS_PREFERENCE_NAME = "Nom de l'option";
    flexiciousNmsp.Constants.OPEN_SETTINGS_DELETE = "effacer";
    flexiciousNmsp.Constants.OPEN_SETTINGS_APPLY = "appliquer";
    flexiciousNmsp.Constants.OPEN_SETTINGS_REMOVE_ALL_SAVED_PREFERENCES = "Supprimer toutes les préférences sauvegardées";
    flexiciousNmsp.Constants.OPEN_SETTINGS_SAVE_CHANGES = "Enregistrer les modifications";
    flexiciousNmsp.Constants.OPEN_SETTINGS_CLOSE = "fermer";



    flexiciousNmsp.Constants.PGR_BTN_WORD_TOOLTIP = "Exporter vers Word";
    flexiciousNmsp.Constants.PGR_BTN_EXCEL_TOOLTIP = "Exporter vers Excel";
    flexiciousNmsp.Constants.PGR_BTN_PDF_TOOLTIP = "Imprimer au format PDF";
    flexiciousNmsp.Constants.PGR_BTN_PRINT_TOOLTIP = "imprimer";
    flexiciousNmsp.Constants.PGR_BTN_CLEAR_FILTER_TOOLTIP = "Effacer le filtre";
    flexiciousNmsp.Constants.PGR_BTN_RUN_FILTER_TOOLTIP = "Exécuter Filtrer";
    flexiciousNmsp.Constants.PGR_BTN_FILTER_TOOLTIP = "Afficher / Masquer filtre";
    flexiciousNmsp.Constants.PGR_BTN_FOOTER_TOOLTIP = "Afficher / Masquer Footer";
    flexiciousNmsp.Constants.PGR_BTN_SAVE_PREFS_TOOLTIP = "Enregistrer les préférences";
    flexiciousNmsp.Constants.PGR_BTN_PREFERENCES_TOOLTIP = "préférences";
    flexiciousNmsp.Constants.PGR_BTN_COLLAPSE_ALL_TOOLTIP = "Réduire tout";
    flexiciousNmsp.Constants.PGR_BTN_EXP_ALL_TOOLTIP = "Développer tout";
    flexiciousNmsp.Constants.PGR_BTN_EXP_ONE_UP_TOOLTIP = "Développer un Level Up";
    flexiciousNmsp.Constants.PGR_BTN_EXP_ONE_DOWN_TOOLTIP = "Développer un niveau plus bas";
    flexiciousNmsp.Constants.PGR_BTN_MCS_TOOLTIP = "Tri sur plusieurs colonnes";

    flexiciousNmsp.Constants.PGR_BTN_FIRST_PAGE_TOOLTIP = "Première page";
    flexiciousNmsp.Constants.PGR_BTN_PREV_PAGE_TOOLTIP = "page précédente";
    flexiciousNmsp.Constants.PGR_BTN_NEXT_PAGE_TOOLTIP = "page suivante";
    flexiciousNmsp.Constants.PGR_BTN_LAST_PAGE_TOOLTIP = "Dernière page";
    flexiciousNmsp.Constants.PGR_LBL_GOTO_PAGE_TEXT = "Aller à la page:";


    flexiciousNmsp.Constants.PGR_ITEMS = "Articles";
    flexiciousNmsp.Constants.PGR_TO = "à";
    flexiciousNmsp.Constants.PGR_OF = "de";
    flexiciousNmsp.Constants.PGR_PAGE = "page";


    flexiciousNmsp.Constants.SELECTED_RECORDS = "enregistrements sélectionnés";
    flexiciousNmsp.Constants.NONE_SELECTED = "Aucune sélection";


    flexiciousNmsp.Constants.EXP_LBL_TITLE_TEXT = "options d'exportation";
    flexiciousNmsp.Constants.EXP_RBN_CURRENT_PAGE_LABEL = "page courante";
    flexiciousNmsp.Constants.EXP_RBN_ALL_PAGES_LABEL = "toutes les pages";
    flexiciousNmsp.Constants.EXP_RBN_SELECT_PGS_LABEL = "spécifiez Pages";
    flexiciousNmsp.Constants.EXP_LBL_EXPORT_FORMAT_TEXT = "Export au format:";
    flexiciousNmsp.Constants.EXP_LBL_COLS_TO_EXPORT_TEXT = "Colonnes à exporter:";
    flexiciousNmsp.Constants.EXP_BTN_EXPORT_LABEL = "exporter";
    flexiciousNmsp.Constants.EXP_BTN_CANCEL_LABEL = "annuler";




    flexiciousNmsp.Constants.PPRV_LBL_TITLE_TEXT = "options d'impression";
    flexiciousNmsp.Constants.PRT_LBL_TITLE_TEXT = "options d'impression";
    flexiciousNmsp.Constants.PRT_LBL_PRT_OPTIONS_TEXT = "options d'impression:";
    flexiciousNmsp.Constants.PRT_RBN_CURRENT_PAGE_LABEL = "page courante";
    flexiciousNmsp.Constants.PRT_RBN_ALL_PAGES_LABEL = "toutes les pages";
    flexiciousNmsp.Constants.PRT_RBN_SELECT_PGS_LABEL = "spécifiez Pages";
    flexiciousNmsp.Constants.PRT_CB_PRVW_PRINT_LABEL = "Aperçu avant impression";
    flexiciousNmsp.Constants.PRT_LBL_COLS_TO_PRINT_TEXT = "Colonnes à imprimer:";
    flexiciousNmsp.Constants.PRT_BTN_PRINT_LABEL = "imprimer";
    flexiciousNmsp.Constants.PRT_BTN_CANCEL_LABEL = "annuler";


    flexiciousNmsp.Constants.PPRV_LBL_PG_SIZE_TEXT = "Taille de la page:";
    flexiciousNmsp.Constants.PPRV_LBL_LAYOUT_TEXT = "Mise en page:";
    flexiciousNmsp.Constants.PPRV_LBL_COLS_TEXT = "colonnes:";
    flexiciousNmsp.Constants.PPRV_CB_PAGE_HDR_LABEL = "tête de page";
    flexiciousNmsp.Constants.PPRV_CB_PAGE_FTR_LABEL = "Pied de page";
    flexiciousNmsp.Constants.PPRV_CB_RPT_FTR_LABEL = "tête de l'état";
    flexiciousNmsp.Constants.PPRV_CB_RPT_HDR_LABEL = "Rapport pied de page";
    flexiciousNmsp.Constants.PPRV_BTN_PRT_LABEL = "imprimer";
    flexiciousNmsp.Constants.PPRV_BTN_CANCEL_LABEL = "annuler";
    flexiciousNmsp.Constants.PPRV_LBL_SETTINGS_1_TEXT = "Remarque: Modification de la taille de page ou mise en page ne ​​mettra à jour l'aperçu, pas la réelle impression.";
    flexiciousNmsp.Constants.PPRV_LBL_SETTINGS_2_TEXT = "S'il vous plaît régler la Taille de la page / Mise en page sur Paramètres de l'imprimante via la boîte de dialogue Imprimer qui sera affiché lorsque vous imprimez.";
    flexiciousNmsp.Constants.PPRV_BTN_PRT_1_LABEL = "imprimer";
    flexiciousNmsp.Constants.PPRV_BTN_CANCEL_1_LABEL = "annuler";
  }
  render() {
    return (
      <div>
        <h1 className='page-title'>Localization</h1>
        <FullWidthSection useContent={true}>

          <ReactDataGrid width={"100%"} forcePagerRow enableExport ref={(grid) => { this.grid = grid; }} dataProvider={Employee.getAllEmployees()} enableDrillDown enableFilters enablePaging enablePreferencePersistence enablePrint preferencePersistenceKey="localization" enableMultiColumnSort>
            <ReactDataGridColumnLevel>

              <ReactDataGridColumn type="checkbox" selectedKeyField="employeeId" />
              <ReactDataGridColumn headerText="ID" dataField="employeeId" filterOperation="Contains" filterControl="TextInput" filterTriggerEvent="enterKeyUp" />
              <ReactDataGridColumn headerText="Nom" labelFunction={this.getFullName} />
              <ReactDataGridColumn textAlign="right" headerAlign="right" labelFunction={UIUtils.dataGridFormatCurrencyLabelFunction} width="100" headerText="Salaire annuel" dataField="annualSalary" filterControl="NumericRangeBox" filterTriggerEvent="enterKeyUp" />
              <ReactDataGridColumn headerText="Etat" dataField="stateCode" />
              <ReactDataGridColumn headerText="Département" dataField="department" filterOperation="Equals" filterControl="MultiSelectComboBox" filterComboBoxBuildFromGrid filterComboBoxWidth="150" />
              <ReactDataGridColumn headerText="Téléphone" dataField="phoneNumber" />
              <ReactDataGridColumn headerText="Actif" dataField="isActive" filterOperation="Equals" filterControl="TriStateCheckBox" footerOperation="count" footerLabel="Count:" footerOperationPrecision="0" />

            </ReactDataGridColumnLevel>
          </ReactDataGrid>

        </FullWidthSection>
      </div>
    );
  }
}



// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - 6 Dec 2015 07:07 GMT
/* jshint asi: true */

/*
 * This file is part of TrelloSync.
 *
 * Copyright (C) 2015 Andrew Roberts (andrew@roberts.net)
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later 
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */

// SettingsObject.gs
// =================
//
// This object manages the user settings.
//
// It isn't called Settings.gs as there is already a file with that name.

var Settings_ = {

/**
 * Display the users settings
 */

display: function() {

  Log.functionEntryPoint() 
  
  var properties = Utils_.getPropertiesService()
  var config = properties.getProperties()
  var headerRow = Utils_.getHeaderRow()
  var template = HtmlService.createTemplateFromFile('Settings')
  
  template.sheetNameOptions = getSheetNames()

  template.boardOptions = createHeaderOptions(PROPERTY_BOARD_COLUMN_INDEX) 
  template.listOptions = createHeaderOptions(PROPERTY_LIST_COLUMN_INDEX)
  template.cardnameOptions = createHeaderOptions(PROPERTY_CARDNAME_COLUMN_INDEX)
  template.descriptionOptions = createHeaderOptions(PROPERTY_DESCRIPTION_COLUMN_INDEX)

  var htmlOutput = template
    .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setHeight(280)
      .setWidth(600)

  Log.fine('Displaying message to user');
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Settings')
  
  return
  
  // Private Functions
  // -----------------

  /**
   * @return {string} a series of HTML 'options' tags to display the sheet names
   */
   
  function getSheetNames() {
    
    Log.functionEntryPoint()
    
    var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets() 
    var storedSheetName = ''
    
    if (config.hasOwnProperty(PROPERTY_TRELLO_SHEET_NAME)) {

      storedSheetName = config[PROPERTY_TRELLO_SHEET_NAME]
      Log.fine('Got sheet name ' + storedSheetName + ' from script property') 
    }
        
    var options = ''
    
    sheets.forEach(function(sheet) {
      var name = sheet.getName()
      var id = sheet.getSheetId()
      var selected = (name === storedSheetName) ? 'selected' : ''
      options += '<option ' + selected + ' name="'  + id + '-name" id="' + id + '-name">' + name + '</option>'
    })
    
    return options
  
  } // Settings_.display.getSheetNames()

  /**
   * @return {string} a series of HTML 'options' tags to display the headers
   *                  of the Trello card sheet
   */
   
  function createHeaderOptions(propertyName) {
  
    Log.functionEntryPoint() 
      
    var options = ''
    var headerIndex
    
    if (config.hasOwnProperty(propertyName)) {

      headerIndex = config[propertyName]
      
      Log.fine(
        'Got index for ' + propertyName + 
          ' from script property (' + headerIndex +')')
      
    } else {

      headerIndex = 0
      properties.setProperty(propertyName, 0)
      config[propertyName] = 0
      Log.fine('Initialising ' + propertyName + ' to zero')
    }
    
    headerIndex = parseInt(headerIndex, 10)

    Utils_.assertValidIndex(headerIndex, propertyName)

    for (var columnIndex = 0; columnIndex < headerRow.length; columnIndex++) {
      var selected = (columnIndex === headerIndex) ? 'selected' : ''
      var cell = headerRow[columnIndex]
      options += '<option ' + selected + ' name="'  + cell + '-name" id="' + cell + '-name">' + cell + '</option>'    
    }
  
    return options

  } // Settings_.display.createHeaderOptions()

}, // Settings_.display()

/**
 * Update the settings
 */
 
update: function(formObject) {

  Log.functionEntryPoint()
  var callingfunction = 'Settings_.update()'
  
  Assert.assertObject(formObject, callingfunction, 'No object from form')

  var properties = Utils_.getPropertiesService()
  
  var sheetName = formObject['sheet-name']
  Log.fine('sheetName: ' + sheetName)
  properties.setProperty(PROPERTY_TRELLO_SHEET_NAME, sheetName)
  
  var headers = Utils_.getHeaderRow()

  properties.setProperty(
    PROPERTY_BOARD_COLUMN_INDEX, 
    getColumnIndex('board-name'))
  
  properties.setProperty(
    PROPERTY_LIST_COLUMN_INDEX, 
    getColumnIndex('list-name'))
    
  properties.setProperty(
    PROPERTY_CARDNAME_COLUMN_INDEX, 
    getColumnIndex('card-name'))
    
  properties.setProperty(
    PROPERTY_DESCRIPTION_COLUMN_INDEX, 
    getColumnIndex('card-description'))

  Utils_.toast('Settings successfully updated.')
  
  return

  // Private Functions
  // -----------------
  
  /**
   * Get the column index of a particular header used to describe a card
   */
  
  function getColumnIndex(optionValue) {
    
    Log.functionEntryPoint()
    Log.fine('optionValue: ' + optionValue)
    var index = headers.indexOf(formObject[optionValue])
    Log.fine('index: ' + index)
    return index

  } // Settings_.update.getColumnIndex()
  
} // Settings_.update()

} // Settings

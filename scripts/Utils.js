// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - 6 Dec 2015 07:40 GMT
/* jshint asi: true */

/*
 * This file is part of TrelloSync.
 *
 * Copyright (C) 2015 Andrew Roberts
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later 
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */

// Utilities.gs
// ============
//
// Utils_ provides local utility functionality to the script

var Utils_ = {

/**
 * @return {array} the headers
 */
 
getHeaderRow: function() {
  
  Log.functionEntryPoint()
 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    
  if (spreadsheet === null) {
    throw new Error('Wrong context - No active spreadsheet.')
  }  

  var trelloSheetName = this.getTrelloSheetName()
  
  var sheet
  var headerRow = []
  
  if (trelloSheetName === null) {
  
    sheet = spreadsheet.getSheets()[0]
    
  } else {
  
    sheet = spreadsheet.getSheetByName(trelloSheetName)
    
    if (sheet === null) {
      throw new Error(
        'There has to be a sheet called ' + trelloSheetName + ' describing the cards.')
    }  
        
    headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0]
  }
  
  return headerRow
  
}, // getHeaderRow()

/**
 * dump the config
 */
 
dumpConfig: function() {
  
  Log.functionEntryPoint()
  
  var scriptProperties = JSON.stringify(PropertiesService.getScriptProperties().getProperties())
  var documentProperties = JSON.stringify(Utils_.getPropertiesService().getProperties())
  var userProperties = JSON.stringify(PropertiesService.getUserProperties().getProperties())
  var caches = JSON.stringify(CacheService.getScriptCache().getAll([]))
  var triggers = ScriptApp.getProjectTriggers()[0]
  var id
  
  if (triggers) {
    id = triggers.getUniqueId()
  }
  
  var message = 
    'Script Properties: ' + (scriptProperties || '') + ' ' +
      'Document Properties: ' + (documentProperties || '') + ' ' + 
      'User Properties: ' + (userProperties || '') + ' ' + 
      'Trigger: ' + (id || '') + ' ' + 
      'Caches: ' + (caches || '')
  
  SpreadsheetApp.getUi().alert(message)
  
}, // dumpConfig()

/**
 * reset all the persistent properties
 */
 
reset: function() {
  
  Log.functionEntryPoint()
  
  if (typeof CBL !== 'undefined') {

    CBL.endContinuousExecutionInstance(
      BATCH_CHARTS_FUNCTION_NAME, 
      ADMIN_EMAIL_ADDRESS, 
      'Batch processing force end')
  }    
      
  var properties = Utils_.getPropertiesService()
  
  if (properties !== null) {
    properties.deleteAllProperties()
  }
  
  properties = PropertiesService.getScriptProperties()      

  if (properties !== null) {
    properties.deleteAllProperties()
  }
  
  properties = PropertiesService.getUserProperties()
  
  if (properties !== null) {
    properties.deleteAllProperties()
  }
    
  CacheService.getScriptCache().removeAll([])
  
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger)
  })
  
  TrelloApi_.reset()
  
  Log.info('Script reset')
  this.toast('All Add-on settings reset.')

}, // Utils_.reset()

/**
 * Clear the development log sheet
 */

clearLog: function() {

  var logSheet
  var logSheetId = Utils_.getLogSheetId()
  
  logSheet = SpreadsheetApp
    .openById(logSheetId)
    .getSheetByName(LOG_SHEET_NAME)
    
  if (logSheet) {
    logSheet.getDataRange().clearContent()
  }
      
}, // Utils_.clearLog()

/**
 * show the authorisation dialog
 */

showAuthorisationDialog: function() {
    
  // This is a special error thrown by TrelloApp to indicate
  // that user authorization is required
  var trelloApp = new TrelloApp.App({log: Log})
  var authorizationUrl = trelloApp.getAuthorizationUri()
  
  Dialog.show(
    'Opening authorization window...', 
      'Follow the instructions in this window, close ' + 
      'it and then try the action again. ' + 
      '<br/><br/>Look out for a warning that ' + 
      'your browser has blocked the authorisation pop-up from Trello. ' + 
      '<script>window.open("' + authorizationUrl + '")</script>',
    160)
    
}, // Utils_.showAuthorisationDialog()

/**
 * Use the fact that NaN is the only value that isn't equal to itself
 * to do a more reliable check for NaN than the global isNaN()
 */
 
isNaN: function(value) {
  
  Log.functionEntryPoint()
  return value !== value

}, // Utils_.isNaN()

/**
 * Assert (only in debug mode) that the index into the card sheet row is valid
 *
 * @param {string} propertyName
 * @param {number} headerIndex
 */
 
assertValidIndex: function(headerIndex, propertyName) {
  
  Log.functionEntryPoint()
  
  if (PRODUCTION_VERSION) {
    return
  }
  
  if (typeof headerIndex !== 'number') {
    throw new TypeError('1st arg must be a number.')
  }

  if (typeof propertyName !== 'string') {
    throw new TypeError('1st arg must be a string.')
  }
  
  if (Utils_.isNaN(headerIndex) || headerIndex < 0) {
    throw new Error('Bad value in column index property: ' + propertyName + '.')
  }
  
}, // Utils_.assertValidIndex()

/**
 * Display a toast dialog
 */
 
toast: function(message) {
  
  Log.functionEntryPoint()
  Log.info(message)
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  if (!PRODUCTION_VERSION && spreadsheet === null) {
    throw new Error('toast() called in wrong context.')
  }
  
  // The -1 means display until the user closes it
  spreadsheet.toast(message, SCRIPT_NAME, -1)
  
}, // Utils_.toast()

/**
 * Init the logging sheet
 */
 
initLog: function(authRequired) {
  
  Log.functionEntryPoint()
  
  if (!authRequired) {
  
    // This sets up the Log sheet which can't be done if the script
    // still needs authenticating
    
    Log.init({
      level: LOG_LEVEL, 
      sheetId: Utils_.getLogSheetId(),
      displayFunctionNames: LOG_DISPLAY_FUNCTION_NAMES})
  }
  
}, // Utils_.initLog()()

/**
 * @return {string} the log sheet Id
 */
 
getLogSheetId: function() {
  
  Log.functionEntryPoint()
  
  var properties = Utils_.getPropertiesService()
  var sheetId = properties.getProperty(PROPERTY_LOG_SHEET_ID)
    
  if (sheetId === null) {
  
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
      
    if (spreadsheet === null) {
      throw new Error('This add-on can only be used in a GSheet.')
    }
    
    sheetId = spreadsheet.getId()
    
    properties.setProperty(PROPERTY_LOG_SHEET_ID, sheetId)
  }
  
  return sheetId
  
}, // Utils_.getLogSheetId()()

/**
 * @return {string} the trello sheet name or null
 */
 
getTrelloSheetName: function() {
  
  Log.functionEntryPoint()
/*  
  var properties = Utils_.getPropertiesService()
  var sheetName = properties.getProperty(PROPERTY_TRELLO_SHEET_NAME)
*/

  var sheetName = TRELLO_SHEET_NAME

  return sheetName
  
}, // Utils_.getTrelloSheetName()()

/**
 * 
 */

getPropertiesService: function() {
  
  Log.functionEntryPoint()
  return PropertiesService.getDocumentProperties()

}, // Utils_.getPropertiesService()

} // Utils_

/**
 * Helper function that puts external JS/CSS into the HTML file
 */
 
function include(filename) {

  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent()
    
} // include()

// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - 6 Dec 2015 07:23 GMT
/* jshint asi: true */

// Code review all files - 6 Dec 2015 07:40 GMT
// JSHint review (see files) - 6 Dec 2015 07:40 GMT
// Unit Tests - NA
// System Test (Dev) - TODO
// System Test (Prod) - TODO

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

/**
 * TrelloSync.gs
 * =============
 *
 * This file provides the external API to this script. 
 *
 * TrelloSync is a Google Sheets add-on that allows any Google Sheet to be 
 * synchronised with a Trello board or set of boards.
 *
 * All externally invoked events are processed in here: menu clicks, triggers, 
 * sheet opening, etc.
 *
 * To avoid too much information being passed up to the user, in PRODUCTION
 * they should all catch errors before displaying them to the user.
 */
 
// General Project TODOs
// ---------------------

// TODO - Check if the card already exists, if so don't create a new one but 
// update existing
// TODO - Create list if one doesn't already exist
// TODO - Add analytics
// TODO - Think about how I could hide the debug functions if this was a library
// TODO - Add links to list of boards
// TODO - Move all TODOs to github issues
// TODO - The list of boards could be stored in cache
// TODO - If the first sheet isn't the Trello sheet, you have to run Settings twice
//        to populate the header list
// TODO - Work on dynamically selecting Trello sheet name
  
// Public event handlers
// ---------------------
//
// All external event handlers need to be top-level function calls and they can't 
// be part of an object, and to ensure they are all processed similarily 
// for things like logging and error handling, they all go through 
// errorHandler_(). These can be called from custom menus, web apps, 
// triggers, etc
// 
// The main functionality of a call is in a function with the same name but 
// post-fixed with an underscore (to indicate it is private to the script)
//
// For debug, rather than production builds, lower level functions are exposed
// in the menu via test functions prefixed with test_

// onOpen() is a special case as it is run whenever a doc is opened, and the script
// may not have permission to do more than add a menu

//   :      [function() {},  '()',      'Failed to ', ],

var EVENT_HANDLERS = {

//                         Initial actions  Name                         onError Message                        Main Functionality
//                         ---------------  ----                         ---------------                        ------------------

  onInstall:               [function() {},  'onInstall()',              'Failed to install RTM',                onInstall_],
  onClearLog:              [function() {},  'onClearLog()',             'Failed to clear log',                  onClearLog_],  
  onUninstall:             [function() {},  'onUninstall()',            'Failed uninstall',                     onUninstall_],  
  onUpdateTrelloBoard:     [function() {},  'onUpdateTrelloBoard()',    'Failed to update Trello boards',       onUpdateTrelloBoard_],  
  onDisplayTrelloBoards:   [function() {},  'onDisplayTrelloBoards()',  'Failed to display Trello boards',      onDisplayTrelloBoards_],
  onDisplaySettings:       [function() {},  'onDisplaySettings()',      'Failed to display settings',           onDisplaySettings_],
  onUpdateSettings:        [function() {},  'onUpdateSettings()',       'Failed to update settings',            onUpdateSettings_],  
  onDumpConfig:            [function() {},  'onDumpConfig()',           'Failed to dump config',                onDumpConfig_],
  onReset:                 [function() {},  'onReset()',                'Failed to reset',                      onReset_],
  onCreateTestCard:        [function() {},  'onCreateTestCard()',       'Failed to create test card',           test_createCard],
}

// function (arg)                     {return eventHandler_(EVENT_HANDLERS., arg)}

function onInstall(arg)                 {return eventHandler_(EVENT_HANDLERS.onInstall, arg)}
function onClearLog(arg)                {return eventHandler_(EVENT_HANDLERS.onClearLog, arg)}
function onUninstall(arg)               {return eventHandler_(EVENT_HANDLERS.onUninstall, arg)}
function onUpdateTrelloBoard(arg)       {return eventHandler_(EVENT_HANDLERS.onUpdateTrelloBoard, arg)}
function onDisplayTrelloBoards(arg)     {return eventHandler_(EVENT_HANDLERS.onDisplayTrelloBoards, arg)}
function onDisplaySettings(arg)         {return eventHandler_(EVENT_HANDLERS.onDisplaySettings, arg)}
function onUpdateSettings(arg)          {return eventHandler_(EVENT_HANDLERS.onUpdateSettings, arg)}
function onDumpConfig(arg)              {return eventHandler_(EVENT_HANDLERS.onDumpConfig, arg)}
function onReset(arg)                   {return eventHandler_(EVENT_HANDLERS.onReset, arg)}
function onCreateTestCard(arg)          {return eventHandler_(EVENT_HANDLERS.onCreateTestCard, arg)}

/**
 * Event handler for the sheet being opened. This is a special case
 * as all it can do is create a menu whereas the usual eventHandler_()
 * does things we don't have permission for at this stage.
 */

function onOpen() {

  Log.functionEntryPoint()
  
  if (FORCE_OPEN_ERROR) {
    throw new Error('Force onOpen() error for testing.')
  }
  
  var ui = SpreadsheetApp.getUi()
  var menu = ui.createAddonMenu()

  menu
    .addItem('Display Trello boards...', 'onDisplayTrelloBoards')
    .addItem('Create Trello cards', 'onUpdateTrelloBoard')
    .addItem('Reset', 'onReset')
    .addSeparator()
    .addItem('Settings...', 'onDisplaySettings')

  if (!PRODUCTION_VERSION) {
    
    menu
      .addSeparator()
      .addItem('Debug - Uninstall...', 'onUninstall')
      .addItem('Debug - Install again...','onInstall')
      .addItem('Debug - Clear log','onClearLog')
      .addItem('Debug - Run unit tests...', 'test_trelloSync')
      .addItem('Debug - Dump config...', 'onDumpConfig')
      .addItem('Debug - Create test card', 'onCreateTestCard')      
  }
  
  menu.addToUi()
    
} // onOpen()

// Private Functions
// =================

function onUpdateTrelloBoard_(arg) {TrelloApi_.uploadCards(arg)}
function onDisplayTrelloBoards_(arg) {TrelloApi_.displayBoards(arg)}
function onDisplaySettings_(arg) {Settings_.display()}
function onUpdateSettings_(arg) {Settings_.update(arg)}
function onDumpConfig_(arg) {Utils_.dumpConfig(arg)}
function onClearLog_(arg) {Utils_.clearLog(arg)}
function onReset_(arg) {Utils_.reset(arg)}

// General
// -------

/**
 * All external function calls should call this to ensure standard 
 * processing - logging, errors, etc - is always done.
 *
 * @param {array} config:
 *   [0] {function} prefunction
 *   [1] {string} eventName
 *   [2] {string} onErrorMessage
 *   [3] {function} mainFunction
 * @parma {object} arg The argument passed to the top-level event handler
 */

function eventHandler_(config, arg) {

  var authMode = ScriptApp
    .getAuthorizationInfo(ScriptApp.AuthMode.FULL)
    .getAuthorizationStatus()
    
  var authRequired = (authMode === ScriptApp.AuthorizationStatus.REQUIRED)
    
  // By default, only one instance of this script can run at a time
  var lock = LockService.getScriptLock()
  
  if (!lock.tryLock(1000)) {
    Utils_.initLog(authRequired)
    Log.warning('Unexpected event - only one instance can run at a time')
    return
  }
  
  try {

    config[0]()

    Utils_.initLog(authRequired)
    
    Log.fine('Handling ' + config[1])
    
    Assert.init({
      handleError: HANDLE_ERROR, 
      sendErrorEmail: SEND_ERROR_EMAIL, 
      emailAddress: ADMIN_EMAIL_ADDRESS,
      scriptName: SCRIPT_NAME,
      scriptVersion: SCRIPT_VERSION, 
    })
    
    return config[3](arg)
    
  } catch (error) {
  
    Log.fine('Caught error: ' + error.name)
  
    if (error.name === 'AuthorizationError') {
    
      Utils_.showAuthorisationDialog()
          
    } else {
    
      Assert.handleError(error, config[2], Log)
    }
    
  } finally {
  
    lock.releaseLock()
  }
  
} // eventHandler_()
 
/**
 * Installation event handler
 */

function onInstall_() {

  Log.functionEntryPoint()
  onOpen()
  
} // onInstall_()

/**
 * Uninstall
 */

function onUninstall_() {

  Log.functionEntryPoint()
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()    
    
  // Menu
  // ----
  
  spreadsheet.removeMenu(SCRIPT_NAME)
  
  SpreadsheetApp
    .getUi()
    .createMenu(SCRIPT_NAME)
    .addItem('Install', 'onInstall')
    .addToUi()
  
  Log.info('deleted menu')
  
  Utils_.toast('Uninstallation finished.')
  
} // onUninstall_()

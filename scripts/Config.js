// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - 6 Dec 2015 07:06 GMT
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
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with 
 * this program. If not, see http://www.gnu.org/licenses/.
 */
    
/**
 * config.gs
 * =========
 *
 * Internal onfiguration settings.
 */

// Config
// ======

var SCRIPT_NAME = 'TrelloSync'
var SCRIPT_VERSION = 'v0.1'

var PRODUCTION_VERSION = true

// Log Library
// -----------

var LOG_SHEET_NAME = 'Log' // This is hard-coded in the Log library
var LOG_LEVEL = PRODUCTION_VERSION ? Log.Level.INFO : Log.Level.FINEST
var LOG_DISPLAY_FUNCTION_NAMES = PRODUCTION_VERSION ? Log.DisplayFunctionNames.NO : Log.DisplayFunctionNames.YES 

// Assert library
// --------------

var SEND_ERROR_EMAIL = false
var HANDLE_ERROR = PRODUCTION_VERSION ? Assert.HandleError.DISPLAY : Assert.HandleError.THROW
var ADMIN_EMAIL_ADDRESS = 'andrewr1969@gmail.com'

var FORCE_DISPLAY_BOARDS_ERROR = false
var FORCE_OPEN_ERROR = false

// Constants/Enums
// ===============

// Settings Dialog
// ---------------

// The index of the options
var BOARD_INDEX = 0
var LIST_INDEX = 1
var CARD_NAME_INDEX = 2
var DESCRIPTION_INDEX = 3

// Properties
// ----------

var PROPERTY_LOG_SHEET_ID = SCRIPT_NAME + '_log_sheet_id'
var PROPERTY_TRELLO_SHEET_NAME = SCRIPT_NAME + '_trello_sheet_name'
var PROPERTY_BOARD_COLUMN_INDEX = SCRIPT_NAME + '_board_column_index'
var PROPERTY_LIST_COLUMN_INDEX = SCRIPT_NAME + '_list_column_index'
var PROPERTY_CARDNAME_COLUMN_INDEX = SCRIPT_NAME + '_cardname_column_index'
var PROPERTY_DESCRIPTION_COLUMN_INDEX = SCRIPT_NAME + '_description_column_index'

// Trello
// ------

var TRELLO_SHEET_NAME = SCRIPT_NAME

var TRELLO_CARD_FIELDS = {

  boardName: 'Board Name',
  listName: 'List Name', 
  name: 'Card Name',
  description: 'Card Description',
}

// Function Template
// -----------------

/**
 * 
 */

function functionTemplate_() {
  
  Log.functionEntryPoint()
  
  

} // functionTemplate_()

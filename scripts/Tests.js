// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO
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

// Tests.gs
// ========
//
// TrelloSync unit tests and debug functions

function test_setUserProperties() {
  PropertiesService.getUserProperties().setProperty(PROPERTY_BOARD_COLUMN_INDEX, '3')
  PropertiesService.getUserProperties().setProperty(PROPERTY_LIST_COLUMN_INDEX, '2')
  PropertiesService.getUserProperties().setProperty(PROPERTY_CARDNAME_COLUMN_INDEX, '1')
  PropertiesService.getUserProperties().setProperty(PROPERTY_DESCRIPTION_COLUMN_INDEX, '0')
  test_dumpConfig()
}

function test_old() {
  ScriptProperties.setProperty('from script')
}

function test_deleteUserProperties() {
  PropertiesService.getUserProperties().deleteAllProperties()
  test_dumpConfig()
}

function test_dumpConfig() {

  Logger.log(PropertiesService.getUserProperties().getProperties())
  Logger.log(PropertiesService.getDocumentProperties().getProperties())  
  Logger.log(PropertiesService.getScriptProperties().getProperties())
}

function test_TrelloApp() {
  TrelloApp
}

// TrelloApp
// ---------

function test_createCard() {

  // Look for 'RTM List 1' in the 'Rose Task Manager' board and 
  // add a new card to it

  var trelloApp = new TrelloApp.App()

  var boards = trelloApp.getMyBoards()
  
  if (boards === null) {
    Utils_.showAuthorisationDialog()
    return
  }
  
  boards.some(function(board) {

    if (board.getName() === 'TrelloSync Test Board 1') {
    
      var lists = trelloApp.getBoardLists(board.getId())
      
      if (lists === null) {
        throw new Error('List Bang!')
      }

      var foundList = lists.some(function(list) {

        if (list.getName() === 'Test List 1') {

          trelloApp.createCard({
            name: 'test card 2', 
            idList: list.getId(),
          }) 

          return true
        }
      }) 

      return foundList
    }
  })

} // test_createCard()

// Settings
// --------

function test_onUpdateSettings() {

  var formObject = {
  
    'board-name': 'Header1',
    'list-name': 'Header2',
    'card-name': 'Header3',
    'card-description': 'Header4',    
  }
  
  onUpdateSettings(formObject)
  
  return
}
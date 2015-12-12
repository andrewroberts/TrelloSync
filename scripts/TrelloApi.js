// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - 6 Dec 2015 07:12 GMT
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

// Trello.gs
// =========
//
// This object provides a wrapper for the rest of this script to use to access 
// the Trello API via the TrelloApp library

var TrelloApi_ = {

  /**
   * Display a list of the boards belonging to this user
   */

  displayBoards: function () {
    
    Log.functionEntryPoint()
    
    if (FORCE_DISPLAY_BOARDS_ERROR) {
      throw new Error('Forced error in displayBoards().')
    }
    
    var trelloApp = new TrelloApp.App()
    var boards = trelloApp.getMyBoards()
    
    if (boards === null) {
      Utils_.toast('No boards found.')
      return
    }
    
    var message = '<ul>'
    var dialogHeight = 90 + (boards.length * 18)
    
    boards.forEach(function(board) {
    
      message += '<li>' + board.getName() + '</li>'
    })
    
    message += '</ul>'
    
    Log.info('Displaying users boards')
    
    Dialog.show('Your Trello Boards:', message, dialogHeight, 400)
    
  }, // TrelloApi_.displayBoards()
  
  /**
   * Create a new card for each row in the sheet
   */

  uploadCards: function() {

    var properties = Utils_.getPropertiesService()
    var trelloApp = new TrelloApp.App()
    var trelloSheetName = Utils_.getTrelloSheetName()
    
    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(trelloSheetName)
      
    if (sheet === null) {
      throw new Error(
        'There has to be a sheet called ' + trelloSheetName + ' describing the cards.')
    }  
      
    var boards = trelloApp.getMyBoards()
      
    if (boards === null) {
      Utils_.toast('No boards found.')
      return
    }
            
    var properties = Utils_.getPropertiesService()
    var rows = sheet.getDataRange().getValues()
    
    // Remove the header
    rows.shift()
    
    var boardColumnIndex = getColumnIndex(PROPERTY_BOARD_COLUMN_INDEX, 'board name')
    var listColumnIndex = getColumnIndex(PROPERTY_LIST_COLUMN_INDEX, 'list name')     
    var cardnameColumnIndex = getColumnIndex(PROPERTY_CARDNAME_COLUMN_INDEX, 'card name')     
    var descriptionColumnIndex = getColumnIndex(PROPERTY_DESCRIPTION_COLUMN_INDEX, 'description')     

    Log.fine('boardColumnIndex: ' + boardColumnIndex)
    Log.fine('listColumnIndex: ' + listColumnIndex)
    Log.fine('cardnameColumnIndex: ' + cardnameColumnIndex)
    Log.fine('descriptionColumnIndex: ' + descriptionColumnIndex)
    
    var cardCount = 0

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      
      var currentRow = rows[rowIndex]

      if (currentRow[cardnameColumnIndex] === '') {
      
        Log.warning('No card name, ignoring row: ' + (rowIndex + 1))
        
      } else {
      
        var boardName = currentRow[boardColumnIndex]
        var listName = currentRow[listColumnIndex]
        var listId = getListId()
        
        if (listId === '') {
          var message = 'Failed to find either list "' + listName + '" and/or board "' + boardName
          Log.warning(message)
          continue
        }
        
        Log.fine('Found Trello list id: ' + listId)

        // TODO - Check if it already exists

        var cardName = currentRow[cardnameColumnIndex]
        var description = currentRow[descriptionColumnIndex]

        trelloApp.createCard({
          name: cardName, 
          desc: description,
          idList: listId,
        })
        
        Log.info('Created new Trello card: ' + cardName)
        cardCount++
      }      
      
    } // for each row
    
    Utils_.toast(cardCount + ' cards created from ' + rowIndex + ' rows.')
    return
    
    // Private Functions
    // -----------------

    /**
     * Get the index at which a particular card property is stored
     */
     
    function getColumnIndex(propertyName, errorMessage) {
      
      Log.functionEntryPoint()
      
      var stringValue = properties.getProperty(propertyName)
      
      if (stringValue === null) {
        throw new Error(
          'Please go to the Settings menu and identify which column ' + 
            'contains the ' + errorMessage + '.')
      }
      
      var numberValue = parseInt(stringValue, 10)
      Log.fine('Got index: ' + numberValue)
      Utils_.assertValidIndex(numberValue, propertyName)
      return numberValue
      
    } // getColumnIndex()

    /**
     * @return {string} the ID of a particular list on a particular board
     */
    
    function getListId() {
   
      var listId = ''
    
      boards.some(function(board) {
        
        if (board.getName() === boardName) {
          
          Log.fine('Found Trello board: ' + boardName)
          
          var foundList = trelloApp.getBoardLists(board.getId()).some(function(list) {
    
            if (list.getName() === listName) {
      
              listId = list.getId()
              Log.fine('Found list 1, id: ' + listId)
              return true
            }
          })
          
          return foundList
        }
      })
      
      return listId
      
    } // TrelloApi_.uploadCards.getListId()    
  
  }, // TrelloApi_.uploadCards()
  
  /**
   * Reset the TrelloApp library
   */
   
  reset: function() {
    
    Log.functionEntryPoint()
    var trelloApp = new TrelloApp.App()
    trelloApp.reset()
      
  }, // TrelloApi_.reset()

} // Trello

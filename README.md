# GAS-TrelloSync
A Google Sheets Apps Script for the bulk production of Trello cards; creating a set of Trello cards from a list in a GSheet.

It uses the [GAS Trello API wrapper library TrelloApp] (https://github.com/andrewroberts/GAS-TrelloApp).

##Future Development
This is only my first bash at creating a GAS Trello App that easily connects to the Trello API (a couple of windows to click through rather than having to copy/paste auth tokens). The main functionality it has at the moment is simply creating Trello cards - with a basic set of properties - from a GSheet. Ultimately this will be an add-on that allows a GSheet to be synced with a Trello board to provide the nice visual UI or Trello along with the compact summary a spreadsheet provides.

At the moment the only card properties that can be specified are:
* board name
* list name
* card name
* card description

## Installation 
You can use the latest code by taking a copy of [this sheet] (https://docs.google.com/spreadsheets/d/1EPjAnOA00aiytra2uhMlg268PS0bKrODhShOFBU8FTU/edit#gid=0) or copy the script files into your own GSheet.

As this is the version I'm actively working on this version probably has debug enabled (var PRODUCTION_VERSION = false), which will carry out extra error checking (making it more robust but a little slower) and displays the debug menu for things like checking the internal properties, forcing the script to reset, uninstalling the script, etc. You can enable production mode by setting "var PRODUCTION_VERSION = true" in config.gs.

## Usage
* **create Trello lists and boards** - ensure you have already created the boards and lists the new cards will use;
* **install the script in your GSheet** - as described above install the script and refresh the sheet to make sure you see the "TrelloSync" custom menu;
* **create your list of cards** - complete or copy/paste a sheet called "TrelloSync" where there is one column for the new cards board name, list name, card name and description;
 
![](https://cloud.githubusercontent.com/assets/4705245/11320464/96dd5060-9090-11e5-9655-5302f82e97d0.png)

* **connect to your Trello account** - use the custom menu "TrelloSync>Display Trello boards..." to authorise a connection between the script and your Trello account - and display a list of your boards (this will take you a series of windows the first time you use it, or if you connection has expired);
* **match columns to card properties** - "TrelloSync>Match headers to Trello card properties";
* **create your new cards** - "TrelloSync>Create Trello cards".
 
You should now see all your new cards in Trello.

A Log sheet is created where you can also check on the progress of the script.

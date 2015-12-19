# TrelloSync

[A Google Sheets Add-on (Apps Script) for the bulk production of Trello cards] (https://chrome.google.com/webstore/detail/trellosync/kghfonofcblmpngnabdfjamaiiindkaa).

**Beta Testers wanted - the add-on isn't available in the chrome web store at the moment as it is still under review, but you can still install the beta version using the above link**

## Getting Started

* Create a new Google Spreadsheet on your [Google Drive] (https://drive.google.com);
* install the TrelloSync add-on (Add-ons>Get add-ons...);
* in the spreadsheet create a sheet called TrelloSync and create one row for each card, with one column for each of the board name, list name, card name and card description;
* create the new Trello cards ("Add-ons>TrelloSync>Create cards").

## Authorisation

The first time you execute any of the menu options you'll need to go through the Trello authorisation flow:

* A dialog in the sheet will instruct you to look out for the first auth window, 

* a new window is automatically opened where you need to click on the link to open the Trello auth window: "Click to authorize Google Apps integration", if you are not logged into Trello you'll be asked to do so;

* in the Trello auth window - "Let TrelloApp use your account?" - click "Allow";

* You should now see "Google Apps integration authorized for user:" and your email address;

You can now close this window and re-attempt the menu action.

It is possible for the app's permission to be revoked from within Trello in which case whenever you try and create new cards TrelloSync will simply report "0 cards created". In this case use "TrelloSync>Reset" and then the next time you attempt to contact Trello you'll run through the auth flow again.

## Support 

Take a look in the [Google+ TrelloSync Community] (https://plus.google.com/communities/110171361404440181188).

Contact [andrew@roberts.net](mailto:andrew@roberts.net) or check out [the issues page] (https://github.com/andrewroberts/TrelloSync/issues).

You can [follow me on twitter] (https://www.twitter.com/andrewroberts6) or [on my blog] (http://www.andrewroberts.net/category/computing/) for the latest updates.

## Developers

The source code is open source and released under GPL v3.

### Manually installing the scripts

If, rather than use the add-on, you want to manually copy the scripts into your own sheet there are several libraries you'll need:

* Assert (MN2v6JNucOc0S385I-FMvAB8_L47d2MW6)
* Log (MqTFuiXcPtS5rVUZ_jC9Z4tnfWGfgtIUb)
* [Dialog] (https://github.com/andrewroberts/GAS-Dialog) (MWPmswuaTtvxxYA71VTxu7B8_L47d2MW6)
* [TrelloApp] (https://github.com/andrewroberts/TrelloApp) (MOXamiHNCH44xpQh9H7FTudnfWGfgtIUb)

The libraries are added under Resources>LIbraries in the script editor using the long ID value. [See the reference docs for more info] (https://developers.google.com/apps-script/guide_libraries).

### Testing

There is a [GDoc test document] (https://docs.google.com/document/d/1bEG0-ekH-0godjc-_xrKDzWnFDy8iiq08RcOKlCbhvM/edit#).

### Copy the Apps Script project

To avoid having to copy/paste these files into your own project you can simply take a copy of:

* [v0.1] (https://script.google.com/d/1wpId9rciaxL0R8e6Qc1NrAapWtzx-kIabUrEKHGXKuFOobYzZpNoNShf/edit?usp=sharing)
* [v0.1.2] (https://script.google.com/d/1L5RCIDS9b-RVF0-kl1aL7QmftEgOQ6PxCa4XyggEFZJgISzSceOQWPv_/edit?usp=sharing)

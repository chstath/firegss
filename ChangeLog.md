# Changes in released versions #

Here are the changes that were featured in each release. The changes can also be viewed when the update mechanism finds a new FireGSS update, by clicking the "Show Information" button.

## Updates in version 0.19.1 ##
  * Compatibility with Firefox 4.0 - 7.0

## Updates in version 0.19 ##
  * Compatibility with Firefox 4.0

## Updates in version 0.18 (2010-10-29) ##
  * Fixed 403 error returned on long upload or sync operations (see [issue 50](https://code.google.com/p/firegss/issues/detail?id=50))

## Updates in version 0.17 (2010-10-11) ##
  * 404 response after renaming a file has been fixed
  * Bug that displayed spaces in filenames as + has been fixed
  * 404 response after uploading files with greek names has been fixed
  * Bug in overwrite confirmation has been fixed
  * Various minor fixes

## Updates in version 0.16.1 (2010-4-22) ##

  * Update an IdP certificate in the whitelist.

## Updates in version 0.16 (2010-3-30) ##

  * Use only encrypted SSL connections to the service.
  * The standalone desktop application is now noticeably faster since it has been updated to use XULRunner 1.9.2 that corresponds to Firefox 3.6.

## Updates in version 0.15.1 (2010-1-25) ##

  * Add a missing IdP certificate to the whitelist.

## Updates in version 0.15 (2010-1-15) ##

  * Implement support for displaying and manipulating files and folders shared by other users.
  * The add-user dialog is now working in the standalone desktop client version.
  * Layout issues in the properties dialog have been fixed.
  * Layout issues in the add-user dialog have been corrected.
  * FireGSS can now be installed in Firefox 3.6.

## Updates in version 0.14 (2009-12-16) ##

  * Fixed a bug that would display a JSON parser error when the trash bin was empty.
  * Empty files can now be properly downloaded.
  * Greek versions of Firefox should work again with FireGSS.
  * A bug that caused modification times to not be retained when downloading multiple files was squashed.
  * Creating local files and folders when downloading is now prevented, since it causes errors when refreshing the folder.
  * The remote context menu now correctly shows the default double-click action in bold.

## Updates in version 0.13 (2009-12-4) ##

  * Files and folders can now be moved to or restored from the trash.
  * The files and folders shared by the user can now be seen collected under the My Shared subtree.
  * Login and logout procedures no longer open a second tab, but reuse the current one.
  * The working indicator is now displayed while the login procedure is ongoing.
  * Remote files can now be opened either by double-clicking the file or selecting the open command from the context menu.
  * The view button from an image files properties dialog was removed, since the same effect can be attained by opening the file.
  * Firefox 3.6 beta 4 is now supported.

## Updates in version 0.12 (2009-11-13) ##

  * Viewing and modifying a file's tags is now supported.
  * The bug that could cause the results of file modification to not be visible from the client in some use cases, has been fixed.
  * Permissons for groups with non-latin names appear correctly now.
  * The button for removing a permission now uses a familiar icon.

## Updates in version 0.11 (2009-11-6) ##

  * A couple of bugs that would cause the program to ask for reauthentication when uploading files with spaces in their name have been fixed.
  * When overwriting files, the confirmation dialog now only shows the file path, not the complete URI.

## Updates in version 0.10 (2009-11-5) ##

  * Remote files and folders can now be renamed.
  * Modifying file and folder properties (name, public and versioned flags, permissions) now correctly sends the modifications to the server. There is a remaining bug however that may cause the results of the modification to not be visible from the client in some use cases.
  * Files with spaces in their name can now be correctly uploaded and modified.
  * A bug that caused the remote pane updates to be botched in some cases on file deletion has been squashed.
  * The remote pane has seen various small fixes and improvements in order to improve consistency with the local pane.

## Updates in version 0.9 (2009-10-23) ##

  * Sync now works for most use cases.
  * Searching for files in the remote service works.
  * File and folder permissions are now displayed in full.
  * Sorting in the remote pane is fixed.
  * The username field now remembers every name entered.
  * There were quite a few style tweaks that hopefully make FireGSS look more natural in every platform.
  * A help menu option to report a bug has been added.
  * A large number of bugs was squashed.

## Updates in version 0.8 (2009-10-2) ##

  * Creating a remote folder now works.
  * The activity indicator has been moved to the bottom right (as the Firefox one) and uses a native O/S widget.
  * Showing the hidden files in the local pane works OK now.
  * The remote pane should refresh more reliably now, after manipulating remote files and folders.
  * File usage statistics for the remote pane now work.
  * Lots of miscellaneous bug fixes.
  * Started work on the synchronization implementation.

## Updates in version 0.7 (2009-9-18) ##

  * Add an activity indicator.
  * Implement Cancel All transfers.
  * Scroll to the new upload or download queue entry.
  * Fix file uploads for file names with single quotes.
  * Serialize file uploads and downloads in orer to avoid silent connection drops from the browser.
  * Display errors from GSS API calls.
  * Fix overwrite confirmation checks for recursive uploads/downloads.

## Updates in version 0.6 (2009-9-11) ##

  * Add button to move to the folder up in the tree.
  * Add copy URL menu item.
  * Reauthenticate on 403 responses.
  * Fix overwrite prompts from file uploads and downloads.
  * Fix the properties dialog.
  * Fix many remote directory traversal and tree refresh bugs.
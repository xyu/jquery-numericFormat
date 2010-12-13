jQuery-numericFormat
====================

A jQuery plugin to format numbers within a table using the standard accountant
style formatting of putting negative numbers within parentheses. Numbers can be
customized independently with the included CSS for negative, positive and zero
amounts.

Usage
-----

Include either the minified or normal JS and CSS files then simply invoke this
plugin on any table.

    jQuery(document).ready(function(){
        jQuery('table.numericFormat').numericFormat();
    });

Please see the included demo.html file for usage example.
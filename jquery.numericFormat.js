/*
 * jQuery Numeric Format Plugin
 * http://github.com/xyu/jquery-numericFormat
 *
 * Copyright (c) 2010 Xiao Yu, @HypertextRanch
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
(function($){
  var regex = {
    addCommas:/(\d+)(\d{3})/,
    getPrecision:/\bprecision-(\d*)/
  }

  var methods = {
    init:function(options){
      return this.each(function(){
        var obj = $(this);
        var data = obj.data('numericFormat');

        if (!data){
          obj.data('numericFormat', $.extend({
              precision:2,
              _lockRedraw:false,
              _colIndex:[]
            },
            options
          ));
        }

        methods._redraw(obj);
        methods._bindEvents(obj);
      });
    },
    _bindEvents:function(obj){
      var data = obj.data('numericFormat');

      obj.bind('DOMSubtreeModified.numericFormat', function(){
        if (!data._lockRedraw){
          methods._redraw(obj);
        }
      });
    },
    _redraw:function(obj){
      var data = obj.data('numericFormat');

      data._lockRedraw = true;

      methods._reindex(obj);

      obj.find('tr:visible').each(function(){
        $(this).find('td').each(function(idx){
          if (data._colIndex[idx] !== false){
            var cell = $(this);

            if (cell.find('span.numericFormat-cell').length == 1){
              return;
            }

            var value = parseFloat(cell.text());

            cell.addClass('numeric');
            if (isNaN(value)){
              cell.html(methods._addSpan('&nbsp;', 'numericFormat-cell'));
            }else{
              cell.html(methods._formatFloat(value, data._colIndex[idx]));
            }
          }
        });
      });

      // Don't try to redraw for 500ms after we are done
      setTimeout(function(){data._lockRedraw = false;}, 500);
    },
    _reindex:function(obj){
      var data = obj.data('numericFormat');

      data._colIndex = [];

      obj.find('thead:first tr:last th').each(function(){
        var element = $(this);
        var precision = false;

        if (element.hasClass('numeric')){
          precision = data.precision;

          var match = element.attr('class').match(regex.getPrecision);
          if (match != undefined && match.length == 2){
            precision = match[1];
          }
        }

        data._colIndex.push(precision);
      });
    },
    _formatFloat:function(value, precision){
      // Round number to precision
      var strVal = '' + Math.abs(Math.round(value * Math.pow(10, precision)));

      // Get parts of number
      if (strVal.length > precision){
        var partWhole = strVal.substr(0, strVal.length - precision);
        var partDecimal = strVal.substr(-precision);
      }else{
        var partWhole = "0";
        var partDecimal = methods._genString('0', precision - strVal.length) + strVal;
      }

      // Get type of formatted number
      if (strVal == "0"){
        var type = 'zero';
      }else if (value < 0){
        var type = 'neg';
      }else{
        var type = 'pos';
      }

      // Don't print decimal if we want precision of 0
      if (precision == 0){
        var result = methods._wrapParentheses(
          methods._addCommas(partWhole)
        );
      }else{
        var result = methods._wrapParentheses(
          methods._addCommas(partWhole) + "." + partDecimal
        );
      }

      return methods._addSpan(result, 'numericFormat-cell ' + type);
    },
    _genString:function(chr, len){
      var str = '';

      for (var i=0; i<len; i++){
        str += chr;
      }

      return str;
    },
    _wrapParentheses:function(str){
      return (
        methods._addSpan('( ', 'parentheses') +
        str +
        methods._addSpan(' )', 'parentheses')
      );
    },
    _addSpan:function(str, className){
      return '<span class="' + className + '">' + str + '</span>';
    },
    _addCommas:function(intStr){
      while (regex.addCommas.test(intStr)){
        intStr = intStr.replace(regex.addCommas, '$1' + ',' + '$2');
      }

      return intStr;
    }
  }

  $.fn.numericFormat = function(){
    return methods.init.apply(this, arguments);
  }
})(jQuery);
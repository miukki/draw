;(function () {
	
	var self = APP.ext = {};
	
	var _word = [];

	var SYMBOL = '_';
	var BACKSPACE = '&larr;';
	var KEYS = [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', BACKSPACE ];
	
	self.init = function () {
	};

	self.keyBoard = function () {
		_word = [];
		
		var useHint = $('#useHint');
		var container = $('#alfabet').html('');

		for (i = 0; i < KEYS.length; ++i) {
			var l = KEYS[i];
			var item = $('<span>' + l + '</span>');
			var cls = 'letter full' + (l == BACKSPACE ? ' larr' : '');
			container.append(item);
			item.addClass(cls);
		};		

		APP.util.click(container.find('.letter'), _click);

		if (APP.user.hint <= 0) {
			useHint.removeClass('orange-gr').addClass('disable').show();
		} else {
			useHint.find('.cnt').html(APP.user.hint);
		};
	};	
	
	self.updateHint = function () {
		var str = APP.ctl.tournament.game.hint;

		for (i = 0; i < str.length; ++i) {
			if (_word[i] && (str[i] != SYMBOL)) {
				_word.splice(i, 1);
			};
		};
		str = self.createHint();

		APP.ctl.tournament.renderHint(str);
		_checkWord();
	};
	
	self.createHint = function () {
		var str = APP.ctl.tournament.game.hint;
		for (i = 0; i < _word.length; ++i) {
			str = str.replace(SYMBOL, _word[i]);
		};
		return str;
	};
	
	self.addHintClass = function () {
		var list = $('#hint').find('.letter');
		var str = APP.ctl.tournament.game.hint;
		for (i = 0; i < str.length; ++i) {
			if (str[i] != SYMBOL) {
				$(list[i]).addClass('orange-gr').removeClass('full');
			};
		};
	};
	
	self.showMsg = function (data) {
		console.log('showMsg');
		$('#user' + data.uid + ' #msg').show().find('#msg-txt').html(data.word);
	};

	var _click = function () {
		var letter = $(this).html();
		if ($(this).hasClass('larr')) {
			letter = '';
		};
		_renderString(letter);
		return false;
	};
	
	var _renderString = function (letter) {
		var str = APP.ctl.tournament.game.hint;
		if (!str) return;
		
		if (letter) {
			_word.push(letter);
		} else {
			_word.pop();
		};
		str = self.createHint();
		
		APP.ctl.tournament.renderHint(str);
		_checkWord();	
	};
	
	var _checkWord = function () {
		var str = APP.ctl.tournament.game.hint;
		var container = $('#alfabet');
		
		if (_getLength() == str.length) {
			container.find('.letter').unbind('click touchstart');
			str = self.createHint();
			var request = new APP.protocol.sayWord({ 'word': str });
			APP.client.send(request);
		};
	};
	
	var _getLength = function () {
		var str = self.createHint();
		var array = str.split('');
		var l = 0;
		for (i = 0; i < array.length; ++i) {
			if (array[i] != SYMBOL) {
				l++;
			};
		};
		return l;
	};

})();
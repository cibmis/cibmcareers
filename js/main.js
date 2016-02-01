/* Gallery */
jQuery.fn.gallery = function(_options){
	// defaults options	
	var _options = jQuery.extend({
		duration: 700,
		autoSlide: false,
		slideElement: 1,
		effect: false,
		fadeEl: 'ul',
		switcher: 'ul > li',
		disableBtn: false,
		next: 'a.link-next, a.btn-next, a.next',
		prev: 'a.link-prev, a.btn-prev, a.prev',
		circle: true
	},_options);

	return this.each(function(){
		var _hold = $(this);
		if (!_options.effect) var _speed = _options.duration;
		else var _speed = $.browser.msie ? 0 : _options.duration;
		var _timer = _options.autoSlide;
		var _sliderEl = _options.slideElement;
		var _wrap = _hold.find(_options.fadeEl);
		var _el = _hold.find(_options.switcher);
		var _next = _hold.find(_options.next);
		var _prev = _hold.find(_options.prev);
		var _count = _el.index(_el.filter(':last'));
		var _w = _el.outerWidth(true);
		var _wrapHolderW = Math.ceil(_wrap.parent().width()/_w);
		if (((_wrapHolderW-1)*_w + _w/2) > _wrap.parent().width()) _wrapHolderW--;
		if (_timer) var _t;
		var _active = _el.index(_el.filter('.active:eq(0)'));
		if (_active < 0) _active = 0;
		var _last = _active;
		if (!_options.effect) var rew = _count - _wrapHolderW + 1;
		else var rew = _count;
		
		if (!_options.effect) _wrap.css({marginLeft: -(_w * _active)});
		else {
			_wrap.css({opacity: 0}).removeClass('active').eq(_active).addClass('active').css({opacity: 1}).css('opacity', 'auto');
			_el.removeClass('active').eq(_active).addClass('active');
		}
		if (_options.disableBtn) {
			if (_count < _wrapHolderW) _next.addClass(_options.disableBtn);
			_prev.addClass(_options.disableBtn);
		}
		
		function fadeElement(){
			_wrap.eq(_last).animate({opacity:0}, {queue:false, duration: _speed});
			_wrap.removeClass('active').eq(_active).addClass('active').animate({
				opacity:1
			}, {queue:false, duration: _speed, complete: function(){
				$(this).css('opacity','auto');
			}});
			_el.removeClass('active').eq(_active).addClass('active');
			_last = _active;
		}
		function scrollEl(){
			_wrap.animate({marginLeft: -(_w * _active)}, {queue:false, duration: _speed});
		}
		function toPrepare(){
			if ((_active == rew) && _options.circle) _active = -_sliderEl;
			for (var i = 0; i < _sliderEl; i++){
				_active++;
				if (_active > rew) {
					_active--;
					if (_options.disableBtn &&(_count > _wrapHolderW)) _next.addClass(_options.disableBtn);
				}
			};
			if (_active == rew) if (_options.disableBtn &&(_count > _wrapHolderW)) _next.addClass(_options.disableBtn);
			if (!_options.effect) scrollEl();
			else fadeElement();
		}
		function runTimer(){
			_t = setInterval(function(){
				toPrepare();
			}, _timer);
		}
		_next.click(function(){
			if(_t) clearTimeout(_t);
			if (_options.disableBtn &&(_count > _wrapHolderW)) _prev.removeClass(_options.disableBtn);
			toPrepare();
			if (_timer) runTimer();
			return false;
		});
		_prev.click(function(){
			if(_t) clearTimeout(_t);
			if (_options.disableBtn &&(_count > _wrapHolderW)) _next.removeClass(_options.disableBtn);
			if ((_active == 0) && _options.circle) _active = rew + _sliderEl;
			for (var i = 0; i < _sliderEl; i++){
				_active--;
				if (_active < 0) {
					_active++;
					if (_options.disableBtn &&(_count > _wrapHolderW)) _prev.addClass(_options.disableBtn);
				}
			};
			if (_active == 0) if (_options.disableBtn &&(_count > _wrapHolderW)) _prev.addClass(_options.disableBtn);
			if (!_options.effect) scrollEl();
			else fadeElement();
			if (_timer) runTimer();
			return false;
		});
		if (_options.effect) _el.click(function(){
			_active = _el.index($(this));
			if(_t) clearTimeout(_t);
			fadeElement();
			if (_timer) runTimer();
		});
		if (_timer) runTimer();
	});
}

$(document).ready(function(){
	$('div.visual').gallery({
		duration: 1000,
		autoSlide: 7000,
		effect: 'fade',
		fadeEl: 'ul > li'
	});
});

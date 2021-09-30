$(document).ready(function() {
	$('.main-navigation a').click(function(e) {
		e.preventDefault();
	});
	$('.date').datepicker({
		dateFormat: "dd/mm/yy",
		changeMonth: true,
		changeYear: true,
		maxDate: -1
	});
	$('.date-trigger').click(function() {
		$(this).siblings('.date').datepicker('show');
	});
	
	function formatOption(option) {
		if (!option.id) {
			return option.text;
		}
		var $option;
		if(option.element.hasAttribute('data-image')) {
			$option = $('<span>'+option.text+'</span><img src="images/'+option.element.getAttribute('data-image')+'.png" alt="Option Value">');
		} else if(option.element.hasAttribute('data-limage')) {
			$option = $('<img src="images/'+option.element.getAttribute('data-limage')+'.png" alt="Option Value"><span>'+option.text+'</span>');
		} else {
			$option = option.text;
		}
		
		return $option;
	};

	$('select:not(.type)').select2({
		width: '100%',
		minimumResultsForSearch: -1,
		templateResult: formatOption,
		templateSelection: formatOption
	}).on("select2:open", function () {
		$('.select2-results__options').niceScroll({
			cursorwidth:15,
			cursorcolor:'#A72421',
			background:"#C7C7C7",
			cursorborder:'none',
			cursorborderradius:0,
			autohidemode:false
		});
	});
	$('select.type').select2({
		width: '475px',
		minimumResultsForSearch: -1,
		templateResult: formatOption,
		templateSelection: formatOption,
		dropdownCssClass: "type-select",
		containerCssClass: "type-container"
	}).on("select2:open", function () {
		$('.select2-results__options').niceScroll({
			cursorwidth:13,
			cursorcolor:'rgba(255, 255, 255, 0.37)',
			background:"#DB1F24",
			cursorborder:'none',
			cursorborderradius:0,
			autohidemode:false
		});
	});
	$('.contacts').niceScroll({
		cursorwidth:15,
		cursorcolor:'#A72421',
		background:"#C7C7C7",
		cursorborder:'none',
		cursorborderradius:0,
		autohidemode:false
	});

	function newChart(id, data, colors, labels) {
		var canvas = document.getElementById(id);
		var ctx = canvas.getContext("2d");
		var lastend = 0;
		var myTotal = 0;

		for(var e = 0; e < data.length; e++)
		{
		  myTotal += data[e];
		}

		var off = 0
		var w = (canvas.width) / 2
		var h = (canvas.height) / 2
		for (var i = 0; i < data.length; i++) {
		  ctx.fillStyle = colors[i];
		  ctx.beginPath();
		  ctx.moveTo(w,h);
		  var len =  (data[i]/myTotal) * 2 * Math.PI
		  var r = h - off / 2
		  ctx.arc(w, h, r, lastend,lastend + len,false);
		  ctx.lineTo(w,h);
		  ctx.fill();
		  
		  var mid = lastend + len / 2;
		  var text = labels[i];
		  text = text.split('\n');
		  for (var j = 0; j<text.length; j++) {
		  	ctx.fillStyle ='white';
		    ctx.font = "13px ar_Aquaguy";
		    ctx.textAlign = "center";
		    ctx.textBaseline = "middle";
		    ctx.fillText(text[j],w + Math.cos(mid) * (r/2), (h + Math.sin(mid) * (r/2))+j*15);
		  }
		  lastend += Math.PI*2*(data[i]/myTotal);
		}
	}

	if($('#chart1').length>0) {
		newChart(
			"chart1",
			[20,40,40],
			['#656C77', '#000000','#DB1F24'],
			['20%', '40%', '40%']
		);
		newChart(
			"chart2",
			[60,40],
			['#656C77', '#DB1F24'],
			['60%\n(M)', '40%\n(F)']
		);
		newChart(
			"chart3",
			[20,40,40],
			['#656C77', '#000000','#DB1F24'],
			['20%', '40%', '40%']
		);
		newChart(
			"chart4",
			[20,40,40],
			['#656C77', '#000000','#DB1F24'],
			['20%', '40%', '40%']
		);
	}
	
	$('.additem').click(function() {
		let option = '<div class="social-item"><img src="'+$(this).prev('.select2').find('.select2-selection__rendered').find('img').attr('src')+'"><input type="text" placeholder="Enter the link to the social network"><span aria-hidden="true">×</span></div>';
		$(option).insertAfter($(this));
		$('.social-item span').click(function() {
			$(this).closest('.social-item').remove();
		});
	});
	$('input, select, textarea').focus(function() {
		if($(this).closest('.field-wrapper').find('.error-message').length > 0)
			$(this).closest('.field-wrapper').find('.error-message').fadeOut().remove();
	});
	$('input[type=checkbox]').change(function() {
		if($(this).closest('.field-wrapper').find('.error-message').length > 0)
			$(this).closest('.field-wrapper').find('.error-message').fadeOut().remove();
	});
	$('input[type=submit]').click(function(e) {
		e.preventDefault();
		let submit = $(this);
		let form = submit.closest('form');
		let fields = form.find('input[type="text"], input[type="password"], textarea, select, input[type="checkbox"]');
		let errorText;
		fields.each(function() {
			if($(this).attr('required') && $(this).val().length === 0) {
				errorText = 'The field must be filled in!';
			} else if($(this).attr('required') && $(this).attr('type') === 'checkbox' && !$(this).is(':checked')) {
				errorText = 'Read the rules';
			} else if($(this).hasClass('flde') && !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($(this).val().toLowerCase()))) {
				errorText = 'Invalid Email entered';
			} else if($(this).hasClass('fldn') && !(/^\d+$/).test($(this).val())) {
				errorText = 'Invalid code entered';
			} else if($(this).hasClass('fldd')) {
				if($(this).val().length < 6) {
					errorText = 'The minimum length is 6 characters';
				} else if($(this).val().length > 24) {
					errorText = 'Maximum length of 24 characters';
				} else if($(this).attr('type') === 'password' && $(this).val() !== form.find('input[type=password]').val()) {
					errorText = 'Passwords don't match';
				}
			} else if($(this).hasClass('date') && !(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/).test($(this).val())) {
				errorText = 'Invalid date entered';
			}
			if(errorText && !$(this).closest('.field-wrapper').find('.error-message').length > 0) {
				$(this).closest('.field-wrapper').append('<span class="error-message">'+errorText+'</span>');
				$(this).closest('.field-wrapper').find('.error-message').fadeIn();
			}
		});
			if(!errorText && form.hasClass('email-confirm')) {
				$('form.code-confirm').fadeIn();
				submit.prop('disabled', true);
				submit.siblings('.timer').html('You can get the code again in <span id="timer" data-timer="3"></span>');
				let counter = $('#timer');
				let counterValue = counter.data('timer')*60;
				let counterInit = 0;
				let counterCompleted = 0;
				for(let i = counterValue; i > 0; i--) {
					(function(ind) {
						setTimeout(function(){
							let minutes = (i - i % 60) / 60;
							let seconds = i % 60;
							if(seconds < 10)
								seconds = '0'+seconds;
							counter.html(minutes+':'+seconds);
							if(i === 1) {
								submit.siblings('.timer').html('');
								submit.removeAttr('disabled');
							}
						}, 1000 * counterInit++);
					})(i);
				}
			} else if(!errorText && form.hasClass('code-confirm')) {
				$('.email-confirm, .code-confirm').fadeOut();
				$('.data-confirm').fadeIn();
			} else if(!errorText && form.hasClass('contact-confirm')) {
				$('.popup.contact-popup').css("display", "flex").hide().fadeIn();
			}
		//form.submit();
	});
	$('.popup-close').click(function() {
		$(this).closest('.popup').fadeOut();
	});
	$('.filter-link').click(function(e) {
		e.preventDefault();
		$(this).closest('.filter-trigger').toggleClass('opened');
	});
});

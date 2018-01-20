$(document).ready(function() {

	/***************** Waypoints ******************/

	function createWaypoint(waypoint) {
		return new Waypoint({
		  element: document.querySelector(waypoint.selector),
		  handler: function(direction) {
		    this.element.classList.add('animated', waypoint.class);
		  },
			offset: '75%'
		});
	}

	var waypoints = [
		{ selector: '.wp1', class: 'fadeInRight' },
		{ selector: '.wp2', class: 'fadeInUp' },
		{ selector: '.wp3', class: 'fadeInUp' },
		{ selector: '.wp4', class: 'fadeInLeft' },
		{ selector: '.wp5', class: 'fadeInRight' },
		{ selector: '.wp6', class: 'fadeInLeft' },
		{ selector: '.wp7', class: 'fadeInRight' },
	];

	waypoints.forEach(function(waypoint) {
		createWaypoint(waypoint);
	});

	/***************** Initiate Flexslider ******************/
	$('.flexslider').flexslider({
    animation: "slide"
  });

	/******************* Initiate Toastr ******************/
	toastr.options.positionClass = 'toast-bottom-left';

	/***************** Contact Form Validation *****************/
	$('#contact-form').validator().on('submit', function(event) {
	  if (!event.isDefaultPrevented()) { //form valid
			event.preventDefault();
			var form = $(event.target);
			console.log('form', form);

			$.ajax({
				url: 'contact.php',
				type: 'POST',
				data: form.serialize(),
				dataType: 'text',
				success: function(msg) {
					toastr.success(msg);
				},
				error: function(msg) {
					toastr.error('Echec : ' + msg);
				}
			});
	  }
	});

	/***************** Tooltips ******************/
  //  $('[data-toggle="tooltip"]').tooltip();


	/***************** Header BG Scroll ******************/

	$(function() {
		var nav = $('section.navigation');
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();

			if (scroll >= 20) {
				nav.addClass('fixed');
			} else {
				nav.removeClass('fixed');
			}
		});
	});
	/***************** Smooth Scrolling ******************/

	$(function() {

		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top - 56 //56px corresponds to the height of the navbar fixed (section.navigation.fixed)
					}, 2000);
					return false;
				}
			}
		});

	});

});

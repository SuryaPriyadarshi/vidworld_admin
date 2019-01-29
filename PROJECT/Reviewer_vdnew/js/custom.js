$(function(){
	/*signup date increment*/

	$(".up").on('click',function(){
        $(this).parent(".incremt ").find("input").val(parseInt($(this).parent(".incremt ").find("input").val())+1);
    });
   /*signup date increment*/
   /*signup date decrement*/
    $(".down").on('click',function(){

        if( $(this).parent(".incremt ").find("input").val() <= 0){
          $(this).parent(".incremt ").find("input").val("0");
        }
        else{

        $(this).parent(".incremt ").find("input").val(parseInt($(this).parent(".incremt ").find("input").val())-1);
        }

    });
	/*signup date decrement*/
	$(".drop-tab").click(function(e){

		$(this).find(".drop-list").toggle();

	});
	$(".drop-list li ").click(function(e){

		$(this).addClass("active").siblings().removeClass("active");
		var listname = $(this).attr('data-value');
		console.log(listname);
		$(this).parents(".drop-tab").find(".selectoption input , input.code-con").val(listname);


	});
	$(".search-sec-1").click(function(e){
		e.stopPropagation();
	})
	$(".month .up").on('click',function(e){

		e.stopPropagation();

		if($(this).parents(".selectoption").next(".months-list").find("li.active").is(':nth-child(2)'))
		{
			$(".months-list").find("li:last-child").addClass("active").siblings().removeClass("active");
		}
		else{
			$(this).parents(".selectoption").next(".months-list").find("li.active").removeClass("active").prev().addClass("active");
			}
		var listname_2 =$(".months-list").find("li.active").attr('data-value');
		$(this).parents(".selectoption").find("input").val(listname_2);

	});
	$(".month .down").on('click',function(e){

		e.stopPropagation();
		/*if($(this).parents(".selectoption").next(".months-list").find("li.active").is(':last-child'))*/
		if($(this).parents(".selectoption").next(".months-list").find("li:last-child").hasClass('active'))
		{
			$(".months-list").find("li:nth-child(2)").addClass("active").siblings().removeClass("active");

		}
		else{
			$(this).parents(".selectoption").next(".months-list").find("li.active").removeClass("active").next().addClass("active");
			}
		var listname_2 =$(".months-list").find("li.active").attr('data-value');
		$(this).parents(".selectoption").find("input").val(listname_2);

	});

	$(".interest-selection .p-check_label input").click(function(){

		if($(".interest-selection .p-check_label input").get(0).hasAttribute('checked')){
			 alert("test1");
			 $(this).parents(".p-check_label").addClass("active");
			}
		else{
			 $(this).parents(".p-check_label").removeClass("active");
		}

	});

	/*More Option*/
	$('.post-options .more, .profile-more .more').on('click', function(){
		$(this).parent().toggleClass('active');
		return(false);
	});
	$(document).on("click" , function(e){
		//debugger;
		if($(".post-options .more, .profile-more .more").length > 0 && !$(e.target).is(".post-options .more, .post-options .more *, .profile-more .more, .profile-more .more *")){
			$('.post-options li').removeClass('active');
			$('.profile-more').removeClass('active');
		}
	});

	/*Header Search*/
	$('.search-sec input').on('focus', function(){
		$(this).parent().addClass('active');
		return(false);
	});
	$(document).on("click" , function(e){
		if($(".search-sec").length > 0 && !$(e.target).is(".search-sec *")){
			$('.search-sec').removeClass('active');
		}
	});

	$('.profile-search input').on('focus', function(){
		$(this).parent().addClass('active');
		return(false);
	})
	$(document).on("click" , function(e){
		if($(".profile-search").length > 0 && !$(e.target).is(".profile-search *")){
			$('.profile-search').removeClass('active');
		}
	});



	/*custompop*/
	$(document).on("click" , "[data-attribute] , [data-attribute] *" , function(e){
		e.preventDefault();
		$("[data-pop='" + $(this).attr("data-attribute")+"']").addClass("opened-pop").fadeIn();
		$("body").addClass("overlay");
	});

	$(document).on("click" , function(e){
		if($(".opened-pop").length > 0 && !$(e.target).is(".opened-pop , .opened-pop  *  , [data-attribute] , [data-attribute] * ")){
			$(".opened-pop").fadeOut();
			$(".popup").removeClass('opened-pop');
			$("body").removeClass("overlay");
		}
	});

	$(".popup-head .close ,.close").click(function(){
		$(".opened-pop").fadeOut();
		$(".popup,.pop-div").removeClass('opened-pop');
		$("body").removeClass("overlay");
	});

	/*Search Clear*/

	$('.ad-search i').on('click', function(){
		$(this).parent().find('input').val('');
	});

	/*Remove Selected Ads*/
	$('.selected-ads li i').on('click', function(){
		$(this).parent('li').remove();
	});


		// Switch Click
	$('.switch').click(function() {

		// Check If Enabled (Has 'On' Class)
		if ($(this).hasClass('on')){

			// Try To Find Checkbox Within Parent Div, And Check It
			$(this).parent().find('input:checkbox').attr('checked', false);

			// Change Button Style - Remove On Class, Add Off Class
			$(this).removeClass('on').addClass('off');

			$(this).parent('.setting-type').removeClass('active');

		} else { // If Button Is Disabled (Has 'Off' Class)

			// Try To Find Checkbox Within Parent Div, And Uncheck It
			$(this).parent().find('input:checkbox').attr('checked', true);

			// Change Button Style - Remove Off Class, Add On Class
			$(this).removeClass('off').addClass('on');

			$(this).parent('.setting-type').addClass('active');

		}
	});

	//custom  selectBox
	enableSelectBoxes();
	function enableSelectBoxes(){
		$('div.selectBox').each(function(){
			$(this).children('span.selected').html($(this).children('ul.selectOptions').children('li.selectOption:first').html());
			$(this).children('ul.selectOptions').children('li.selectOption:first').addClass('placeholder-text');

			$(this).children('span.selected,span.selectArrow').click(function(){
				if($(this).parent().children('ul.selectOptions').css('display') == 'none'){
					$(this).parent().children('ul.selectOptions').slideDown('fast');
				}
				else
				{
					$(this).parent().children('ul.selectOptions').slideUp('fast');
				}
			});

			$(this).find('li.selectOption').click(function(){
				$(this).parent().slideUp('fast');
				$(this).parent().siblings('span.selected').html($(this).html());
				if($(this).hasClass('placeholder-text')){
					$(this).parent().siblings('span.selected').addClass('placeholder-styl');
				}else{
					$(this).parent().siblings('span.selected').removeClass('placeholder-styl');
				}
			});

		});
	}

/*tab-menu*/
$(".tab-menu ol li").click(function(){
	$(this).addClass("active").siblings().removeClass("active");	
	var tabindex = $(this).index();
	$(".tab-menu").next(".tab-sec").children("div").eq(tabindex).addClass("active").siblings().removeClass("active");	
});

$('.popup-footer.message-request-action').css('display' , 'none');

$(".tab-menu-1 ul li").click(function() {
	$(this).addClass("active").siblings().removeClass("active");
	var tabindex = $(this).index();
	$(this).parents('.popup').find('.tab-sec-1').children("div").eq(tabindex).addClass("active").siblings().removeClass("active");

	
	if($('.popup-body .message-request').hasClass('active')) {
		$('.popup-footer.message-request-action').css('display','block');
	} else {
		$('.popup-footer.message-request-action').css('display','none');
	}
});





});

 $(window).on("load resize",function(){

       var sec_height_1 = $(window).innerHeight() - $("header").outerHeight() - $("footer").outerHeight();
	   $(".mid-container").css("min-height",sec_height_1);
 });


 $(window).on("load", function () {

     

	$(this).scrollTop(0);
	var $animation_elements = $('.animated');
	var $window = $(window);
	function check_if_in_view() {
		var window_height = $window.height();
		var window_top_position = $window.scrollTop();
		var window_bottom_position = (window_top_position + window_height);
		$.each($animation_elements, function() {
			var $element = $(this);
			var element_height = $element.outerHeight();
			var element_top_position = $element.offset().top;

			var element_bottom_position = (element_top_position + element_height);

			//check to see if this current container is within viewport
			if (element_top_position <= window_bottom_position) {
			  $element.addClass('go');
			}
		});
	}

	$window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');
});

 $(document).ready(function (e) {
     alert(1);
     if (location.protocol != 'https:') {
         location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
     }

	var check = 0;
	// FIRST HAMBURGER
	$('.toggle-menu').on('click', function() {
		$('nav').toggleClass('active');
		if (check == 0) {
			$('#middle').css('opacity', '0')
			$('#top').css({'transform' : 'rotateZ(45deg)', 'top' : '7px'})
			$('#bottom').css({'transform' : 'rotateZ(-45deg)', 'top' : '7px'})
			setTimeout(function() {
				check++;
			},100)
		}
		if (check == 1) {
			$('#middle').css('opacity', '1')
			$('#top').css({'transform' : 'rotateZ(0deg)', 'top' : '0px'})
			$('#bottom').css({'transform' : 'rotateZ(0deg)', 'top' : '14px'})
			setTimeout(function() {
				check = 0;
			},100)
		}

		$('nav > ul').slideToggle('medium');
	});

	/*Left Menu arrow icon when check sub-menu*/
	$('.nwside-bar-list li').each(function() {
		$('.nwside-bar-list li').has('ul').addClass('sub-menu');
	});

	$('.popup .chat-request .decline > a').on('click', function() {
		$(this).parent().toggleClass('active');
	});

	$(document).on("click" , function(e){
		if($(".popup .chat-request .decline").length > 0 && !$(e.target).is(".popup .chat-request .decline > a")){
			$(".popup .chat-request .decline").removeClass('active');
		}
	});

	$('.change-number-pop').on('click', function(){
		$(this).parents('.popup').find('.change-number').show();
		return false;
	});
	$('.change-number .close-btn, .change-number-btn .change-btn').on('click', function() {
		$(this).parents('.change-number').hide();
		return false;
	});



});
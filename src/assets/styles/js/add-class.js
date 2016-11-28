$(function() {
	$(".btn-small-red,.btn-small-green").on("click", function(event) {
		$(event.target).parents('.table-row').addClass("hidden")
	});
});
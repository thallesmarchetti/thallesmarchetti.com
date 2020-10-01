$(document).ready(() => {
    $("a").on("click", function (event) {
	  if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;

            $("html, body").animate({
		  scrollTop: $(hash).offset().top,
            }, 1200, () => {
		  window.location.hash = hash;
            });
	  }
    });
});

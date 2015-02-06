/*jshint browser:true*/
/*globals clientConfig*/

function run() {
  var ref;
  function startAutoScroll() {
    function scroll() {
      var elem = document.getElementById('container');
      elem && elem.scrollIntoView(false);
    }
    ref = window.setInterval(scroll, clientConfig.scrollDownInterval);
    scroll();
  }

  function stopAutoScroll() {
    clearInterval(ref);
  }

  var scrollToggle = document.getElementById('autoscrollToggle');

  if (scrollToggle) {
    scrollToggle.addEventListener('change', function () {
      if (scrollToggle.checked) {
        startAutoScroll();
      } else {
        stopAutoScroll();
      }
    });
  }

  if (clientConfig.autoscroll) {
    startAutoScroll();
  }
}
run();

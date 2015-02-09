/*jshint browser:true*/
/*globals clientConfig*/

function run() {
  var local_storage_key = 'pipe-to-browser.autoscroll';
  var ref;
  function startAutoScroll() {
    var last_size = 0;
    function scroll() {
      var elem = document.getElementById('container');
      if (!elem) {
        return;
      }
      var h = elem.scrollHeight;
      if (h === last_size) {
        return;
      }
      // Only scroll if the content has changed
      last_size = h;
      elem.scrollIntoView(false);
    }
    ref = window.setInterval(scroll, clientConfig.scrollDownInterval);
    scroll(); // scroll immediately when toggling the option
  }

  function stopAutoScroll() {
    clearInterval(ref);
  }

  var scrollToggle = document.getElementById('autoscrollToggle');

  if (scrollToggle) {
    scrollToggle.addEventListener('change', function () {
      if (scrollToggle.checked) {
        localStorage[local_storage_key] = 'on';
        startAutoScroll();
      } else {
        localStorage[local_storage_key] = 'off';
        stopAutoScroll();
      }
    });
  }

  if (localStorage[local_storage_key]) {
    if (localStorage[local_storage_key] === 'on') {
      startAutoScroll();
      scrollToggle.checked = 'checked';
    } else {
      scrollToggle.checked = false;
    }
  } else if (clientConfig.autoscroll) {
    startAutoScroll();
  }
}
run();

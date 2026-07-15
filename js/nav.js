document.addEventListener('click', function (e) {
  var t = e.target.closest('.nav-toggle');
  if (!t) return;
  var nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('open');
});

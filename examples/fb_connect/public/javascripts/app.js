$(document).ready(function () {
  // FB Connect action
  $('#fb-connect').bind('click', function () {
    $.fbConnect({'include': ['first_name', 'last_name', 'name', 'pic']}, function (fbSession) {
      $('.not_authenticated').hide();
      $('.authenticated').show();
      $('#fb-name').html(fbSession.name);
    });
   return false;
  });

  // FB Logout action
  $('#fb-logout').bind('click', function () {
    $.fbLogout(function () {
      $('.authenticated').toggle();
      $('.not_authenticated').toggle();
    });
    return false;
  });

  // Check whether we're logged in and arrange page accordingly
  $.fbIsAuthenticated(function (fbSession) {
    // Authenticated!
    $('.authenticated').show();
    $('#fb-name').html(fbSession.name);
  }, function () {
    // Not authenticated
    $('.not_authenticated').show();
  });
});

$(document).ready(function() {
  $('select').change(function() {
    var select = $(this),
      id = this.id.substring(0, this.id.length-6),
      newSubject = select.val();
    $.ajax('/update/', {
      data: { 
        newSubject: newSubject,
        id: id
      },
      type: 'PUT'
    }).done(function() {
      $('#'+id+'subject').text(newSubject);
    });
  });
});

var report = function(id, type) {
  $.ajax('/report/', {
    data: {
      id: id,
    type: type
    },
    type: 'PUT'
  }).done(function() {
    $('#'+id+'button').addClass('btn-success');
  }).error(function() {
    $('#'+id+'button').addClass('btn-danger');
  });
}

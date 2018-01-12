$(document).ready(function() {
    
$('.submit-button').click(function (e) {
    $(this).parent().submit()
})

  $('.vote-up').submit(function (e) {
    e.preventDefault();
    var answerId = $(this).data('id');
    $.ajax({
      type: 'PUT',
      url: "/comments/" + answerId + '/vote-up',
      success: function(data) {
          console.log("voted up!");
          response = JSON.parse(data)
          $('#answer-' + response.id).html(response.score);
      },
      error: function(err) {
        console.log(err.messsage);
      }
    });
  });

  $('.vote-down').submit(function (e) {
    e.preventDefault();
    var answerId = $(this).data('id');
    $.ajax({
      type: 'PUT',
      url: "/comments/" + answerId + '/vote-down',
      success: function(data) {
        console.log("voted down!");
        response = JSON.parse(data)
        $('#answer-' + response.id).html(response.score);
      },
      error: function(err) {
        console.log(err.messsage);
      }
  })

  });

});

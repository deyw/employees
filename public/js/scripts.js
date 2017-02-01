/* eslint no-undef: 0 */
$('document').ready(function () {

  // Disable submit button if input fileds are empty
  $(':submit').prop('disabled', true);
  $(':input', '.form').keyup(function () {
    let empty = false;
    $('input').each(function () {
      if ($(this).val() == '') {
        empty = true;
      }
    });
    if (empty) {
      $(':submit').prop('disabled', 'disabled');
    } else {
      $(':submit').prop('disabled', false);
    }
  });

  // Add employee request
  $('.form').on('submit', function (evt) {
    evt.preventDefault();
    const action = $(this).attr('action');
    const $message = $('.message');

    const $jobTitleText = $('#jobTitleSelect option:selected').text();
    let serializedData = $(this).find('input').serialize();
    serializedData += `&jobTitle=${$jobTitleText}`;

    $.ajax({
      url: action,
      type: 'POST',
      data: serializedData,
      success: function (data) {
        if (data.success) {
          $message.html('<h2 style="color:green">Success</h2>');
          $(':submit').prop('disabled', 'disabled');
          // clear form fields
          $(':input', '.form')
            .not(':button, :submit, :reset, :hidden')
            .val('');
          setTimeout(function () {
            $message.fadeOut();
          }, 2000);
        } else {
          $container.html('<h2>Error</h2>');
          setTimeout(function () {
            $message.fadeOut();
          }, 2000);
        }
      },
      error: function () {
        $message.html('<h2>Error</h2>');
      }
    });
  });


  $('.delete').on('click', function (e) {
    e.preventDefault();
    const userRow = $(this).closest('tr');
    const id = $(this).attr('id');
    if (confirm('Confirm delete user?')) {
      $.ajax({
        type: 'DELETE',
        url: `/employee/${id}`,
        success: function (success) {
          alert(success.message);
          userRow.slideUp('slow', function () {
            $(this).remove();
          });
          if (userRow === 0) {
            $('.container').append('<h2>Now users</h2>');
          }
        },
        error: function (error) {
          alert(error.message);
        }
      });
    }

  });

});
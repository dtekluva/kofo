'use strict'
// var host ="http://localhost:8000/";
var host = window.location.hostname == 'localhost'
    ? 'http://localhost:8000/'
    : 'http://' + window.location.hostname + '/'


var get_year = _date => {
  let _year = new Date(_date)
  return _year.getFullYear()
}

// #ADD EXPENSE SECTION

$('#add_expense_form').on('submit', async e => {
  e.preventDefault()
  let csrftoken = $('[name="csrfmiddlewaretoken"]')[0].value
  let form_is_ok = $('#is_ok')[0].checked
  
  let data = `${$('#add_expense_form').serialize()}` // add lives_in select value to post data

  if (form_is_ok){
      function csrfSafeMethod (method) {
            // these HTTP methods do not require CSRF protection
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
      }

      $.ajaxSetup({
        beforeSend: function (xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken)
          }
        }
      })
      $.post(host + 'save_expense', data)
            .then(resp => {
              console.log(JSON.parse(resp))
              resp = JSON.parse(resp)

              if (resp.response == 'success') {
                $('.bd-example-modal-sm').modal('show')
              } else {
                $('.bd-example-modal-sm-fail').modal('show')
              }
            })
            .catch(() => {
              $('.bd-example-modal-sm-fail').modal('show')
            }) // post data
          }else{
            $('.bd-example-modal-sm-confirm').modal('show')
          }
})


// #EDIT USER SECTION

$('#add_income_form').on('submit', async e => {
  e.preventDefault()
  let csrftoken = $('[name="csrfmiddlewaretoken"]')[0].value
  let user_id = $('#user_id')[0].value
  let form_is_ok = $('#is_ok')[0].checked
  
  let data = `${$('#add_income_form').serialize()}&user_id=${user_id}` // add lives_in select value to post data

  if (form_is_ok){
      function csrfSafeMethod (method) {
            // these HTTP methods do not require CSRF protection
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
      }

      $.ajaxSetup({
        beforeSend: function (xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken)
          }
        }
      })
      $.post(host + 'save_income', data)
            .then(resp => {
              console.log(JSON.parse(resp))
              resp = JSON.parse(resp)

              if (resp.response == 'success') {
                $('.bd-example-modal-sm').modal('show')
              } else {
                $('.bd-example-modal-sm-fail').modal('show')
              }
            })
            .catch(() => {
              $('.bd-example-modal-sm-fail').modal('show')
            }) // post data
          }else{
            $('.bd-example-modal-sm-confirm').modal('show')
          }
})

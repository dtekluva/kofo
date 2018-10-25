'use strict'
// var host ="http://localhost:8000/";
var host = window.location.hostname == 'localhost'
    ? 'http://localhost:8000/'
    : 'http://' + window.location.hostname + '/'
/*

Main javascript functions to init most of the elements

#1. CHAT APP
#2. CALENDAR INIT
#3. FORM VALIDATION
#4. DATE RANGE PICKER
#5. DATATABLES
#6. EDITABLE TABLES
#7. FORM STEPS FUNCTIONALITY
#8. SELECT 2 ACTIVATION
#9. CKEDITOR ACTIVATION
#10. CHARTJS CHARTS http://www.chartjs.org/
#11. MENU RELATED STUFF
#12. CONTENT SIDE PANEL TOGGLER
#13. EMAIL APP
#14. FULL CHAT APP
#15. CRM PIPELINE
#16. OUR OWN CUSTOM DROPDOWNS
#17. BOOTSTRAP RELATED JS ACTIVATIONS
#18. TODO Application
#19. Fancy Selector
#20. SUPPORT SERVICE
#21. Onboarding Screens Modal
#22. Colors Toggler
#23. Auto Suggest Search
#24. Element Actions

*/

// listen for month change

$('#month_selec').on('change', async function () {
    // console.dir(this.value.toLowerCase());
  dataSet = []
  let current_month = document.getElementById('month_selec').value.toLowerCase()
  let current_year = document.getElementById('year_selec').value
  evaluate_data_for_table(current_month, current_year)
  update_table()
})

// #5. DATATABLES

var dataSet = []
var date_data = []
var useraccounts = []
var users = []
var transactions = []
let _all_months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
]

var create_table = () => {
    // console.log(dataSet)
  $(document).ready(function () {
    var table = $('#dataTable1').DataTable({
      data: dataSet,
      pageLength: 20,
      columns: [{ title: 'Date' }, { title: 'Desciption' }, { title: 'Amount' }],
      dom: 'f',
      buttons: ['copy', 'excel', 'csv', 'pdf']
    })

    $('.dt-buttons').find('*').addClass('btn btn-primary btn-sm')
  })
}

// btn btn-primary btn-sm

var update_table = () => {
  $('#dataTable1').dataTable().fnClearTable()
  $('#dataTable1').dataTable().fnAddData(dataSet)
}

var promise = $.getJSON(host + 'get_data')

promise
    .done(function (data) {
      rearrange_response(data)
      const date = new Date()
      let current_month = _all_months[date.getUTCMonth()]
      let current_year = date.getFullYear()

      date_data = [current_month, current_year]
    })
    .then(() => {
      evaluate_data_for_table(date_data[0], date_data[1])
    })
    .then(() => {
      create_table()
    })

// #MISC update totals in html

function update_totals (t_posts, devices, posts_t) {
  let total_posts = (document.getElementById('t_posts').innerHTML = t_posts)
  let total_devices = (document.getElementById('devices').innerHTML = devices)
  let total_today = (document.getElementById('t_today').innerHTML = posts_t)
}

var rearrange_response = data => {
  data.forEach(element => {
    if (element.model == 'useraccounts.transactions') {
      transactions.push(element)
    }
  })
}

var evaluate_data_for_table = (current_month, current_year) => {
    // console.log(useraccounts)
    // console.log(useraccounts, users, transactions)
  transactions.forEach(element => {
        // console.log(_all_months.indexOf(current_month.toLowerCase()))
    if (
            element.fields.transaction_type == 'expense' &&
            _all_months.indexOf(current_month.toLowerCase()) == _all_months.indexOf(element.fields.month) &&
            get_year(element.fields.date) == current_year
        ) {
            // console.log(current_year)
      let new_arr = []
      new_arr.push(element.fields.date)
      new_arr.push(element.fields.description)
      new_arr.push(element.fields.amount)
      dataSet.push(new_arr)
    }
  })
    //  console.log(dataSet)
}

var get_bal = (user, current_month) => {
  let total_paid = 0
  let actual_bill = (_all_months.indexOf(current_month) + 1) * user.fields.fee

  transactions.forEach(element => {
    if (
            element.fields.user == user.fields.user &&
            _all_months.indexOf(current_month.toLowerCase()) >= _all_months.indexOf(element.fields.month)
        ) {
      total_paid += element.fields.amount
    }
  })
  return actual_bill - total_paid < 0 ? 0 : actual_bill - total_paid
}

var get_excess = (user, current_month) => {
  let _all_months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]

  let total_paid = 0
  let actual_bill = (_all_months.indexOf(current_month) + 1) * user.fields.fee

  transactions.forEach(element => {
    if (
            element.fields.user == user.fields.user &&
            _all_months.indexOf(current_month.toLowerCase()) >= _all_months.indexOf(element.fields.month)
        ) {
      total_paid += element.fields.amount
    }
  })
  return actual_bill - total_paid > 0 ? 0 : (actual_bill - total_paid) * -1
}

var get_paid = (user, current_month) => {
  let _all_months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december'
  ]

  let total_paid = 0

  transactions.forEach(element => {
        // console.log(current_month)
    if (
            element.fields.user == user.fields.user &&
            current_month.toLowerCase() == element.fields.month &&
            get_year(element.fields.date) == current_year
        ) {
            // console.log(element.fields.user, element.fields.amount)
      total_paid += element.fields.amount
    }
  })
  return total_paid
}

var get_year = _date => {
  let _year = new Date(_date)
  return _year.getFullYear()
}

// #ADD USER SECTION

$('#add_form').on('submit', async e => {
  e.preventDefault()
  let csrftoken = $('[name="csrfmiddlewaretoken"]')[0].value
  let lives_in = $('#lives_in')[0].value
  let is_active = $('#is_active')[0].checked

  let data = `${$('#add_form').serialize()}&lives_in=${lives_in}&is_active=${is_active}` // add lives_in select value to post data

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

  $.post(host + 'add_user?&is_active=' + is_active, data)
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
})

// #EDIT USER SECTION

$('#edit_form').on('submit', async e => {
  e.preventDefault()
  let csrftoken = $('[name="csrfmiddlewaretoken"]')[0].value
  let user_id = $('[name="user_id"]')[0].value
  let lives_in = $('#lives_in')[0].value
  let is_active = $('#is_active')[0].checked

  let data = `${$('#edit_form').serialize()}&lives_in=${lives_in}&is_active=${is_active}` // add lives_in select value to post data

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
  $.post(host + 'post_data?userid=' + user_id, data)
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
})

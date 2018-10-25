'use strict';
// var host ="http://localhost:8000/";
// var host ="http://192.168.43.118:80/";

var host = window.location.hostname == "localhost"? "http://localhost:8000/" : 'http://'+window.location.hostname + '/' ;
// console.log(window.location.hostname)
// console.log(host)
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

// ------------------------------------
// HELPER FUNCTIONS TO TEST FOR SPECIFIC DISPLAY SIZE (RESPONSIVE HELPERS)
// ------------------------------------

function is_display_type(display_type) {
  return $('.display-type').css('content') == display_type || $('.display-type').css('content') == '"' + display_type + '"';
}
function not_display_type(display_type) {
  return $('.display-type').css('content') != display_type && $('.display-type').css('content') != '"' + display_type + '"';
}

// Initiate on click and on hover sub menu activation logic
function os_init_sub_menus() {

  // INIT MENU TO ACTIVATE ON HOVER
  var menu_timer;
  $('.menu-activated-on-hover').on('mouseenter', 'ul.main-menu > li.has-sub-menu', function () {
    var $elem = $(this);
    clearTimeout(menu_timer);
    $elem.closest('ul').addClass('has-active').find('> li').removeClass('active');
    $elem.addClass('active');
  });

  $('.menu-activated-on-hover').on('mouseleave', 'ul.main-menu > li.has-sub-menu', function () {
    var $elem = $(this);
    menu_timer = setTimeout(function () {
      $elem.removeClass('active').closest('ul').removeClass('has-active');
    }, 30);
  });

  // INIT MENU TO ACTIVATE ON CLICK
  $('.menu-activated-on-click').on('click', 'li.has-sub-menu > a', function (event) {
    var $elem = $(this).closest('li');
    if ($elem.hasClass('active')) {
      $elem.removeClass('active');
    } else {
      $elem.closest('ul').find('li.active').removeClass('active');
      $elem.addClass('active');
    }
    return false;
  });
}





$(function () {




//listen for month change

$('#month_selec').on('change', (async function () {
  // console.dir(this.value.toLowerCase());
  dataSet = [];
  let current_month = (document.getElementById('month_selec').value).toLowerCase();
  let current_year = (document.getElementById('year_selec').value);
  evaluate_data_for_table(current_month, current_year );
  // console.log(current_year)
  update_table();
}));

  // #5. DATATABLES

var dataSet = [];
var date_data = [];
var useraccounts = [];
var users = [];
var transactions = [];
let _all_months = ["january", "february", "march", "april", "may", "june", "july", 
                    "august", "september", "october", "november", "december"]

var create_table = ()=>{
  // console.log(dataSet)
$(document).ready(function() {

  var table = $('#example').DataTable( {
      data: dataSet,
      "pageLength":20,
      columns: [
          { title: "NAME" },
          { title: "APPARTMENT" },
          { title: "BILL" },
          { title: "PAID" },
          { title: "BALANCE" },
          { title: "EXCESS" }
      ],
      dom: 'Bf',
        buttons: [
            'excel',
            'pdf'
        ]
  } );
  
  $('.dt-buttons').find('*').addClass('btn btn-primary btn-sm')

} );

}

// btn btn-primary btn-sm

var update_table = (()=>{
      
      $('#example').dataTable().fnClearTable();
      $('#example').dataTable().fnAddData(dataSet);
})
  
var promise = $.getJSON(host + "get_data");

promise.done(function(data) {

            rearrange_response(data);
            const date = (new Date);
            let current_month =  _all_months[date.getUTCMonth()];
            let current_year = date.getFullYear();

            date_data = [current_month, current_year];

          }).then(()=>{

            evaluate_data_for_table(date_data[0], date_data[1]);
            
          }).then(()=>{

            create_table();

          });





  // #MISC update totals in html

function update_totals(t_posts, devices, posts_t ){
    let total_posts = (document.getElementById('t_posts').innerHTML) = t_posts
    let total_devices = (document.getElementById('devices').innerHTML) =devices
    let total_today = (document.getElementById('t_today').innerHTML) =  posts_t
    }


var rearrange_response = (data)=>{

  data.forEach(element => {
    if(element.model == "auth.user"){
      users.push(element)
    }
    else if (element.model == "useraccounts.useraccount"){
      useraccounts.push(element)
    }
    else if (element.model == "useraccounts.transactions"){
      transactions.push(element)
    };
  });
}

var evaluate_data_for_table = ((current_month, current_year)=>{
// console.log(useraccounts)
  useraccounts.forEach((element) => {
    // console.log(element.fields.fname)
        let new_arr = [];
        new_arr.push((element.fields.fname).toUpperCase() + "  " + (element.fields.lname).toUpperCase() ) 
        new_arr.push(element.fields.address) 
        new_arr.push(element.fields.fee) 
        new_arr.push(get_paid(element, current_month, current_year)) //change to amount paid from transactions
        new_arr.push(get_bal(element, current_month, current_year)) //resolve balance write function
        new_arr.push(get_excess(element, current_month, current_year)) //resolve Excess

    dataSet.push(new_arr)
   });
})

var get_bal = ((user, current_month, current_year)=>{


  let total_paid = 0
  let actual_bill = (_all_months.indexOf(current_month)+1) * user.fields.fee

  transactions.forEach((element)=>{

    if (element.fields.user == user.fields.user && 
        _all_months.indexOf(current_month.toLowerCase()) >= _all_months.indexOf(element.fields.month) && 
        get_year(element.fields.date) == current_year){
      // console.log(get_year(element.fields.date) == current_year );
          total_paid += element.fields.amount;
      }
      
  })
  return (actual_bill - total_paid) < 0 ? 0 : (actual_bill - total_paid) ;
});

var get_excess = ((user, current_month, current_year)=>{
  let _all_months = ["january", "february", "march", "april", "may", "june", "july", 
                      "august", "september", "october", "november", "december"]

  let total_paid = 0
  let actual_bill = (_all_months.indexOf(current_month)+1) * user.fields.fee

  transactions.forEach((element)=>{
      // console.log(element)
      if (element.fields.user == user.fields.user  && 
        _all_months.indexOf(current_month.toLowerCase()) >= _all_months.indexOf(element.fields.month) &&
        get_year(element.fields.date) == current_year){

          total_paid += element.fields.amount
      }
      
  })
  return (actual_bill - total_paid) > 0 ? 0 : (actual_bill - total_paid) * -1  ;
});

var get_paid = ((user, current_month, current_year)=>{
  let _all_months = ["january", "february", "march", "april", "may", "june", "july", 
                      "august", "september", "october", "november", "december"]

  let total_paid = 0

  transactions.forEach((element)=>{
    // console.log(current_month)
      if (element.fields.user == user.fields.user && current_month.toLowerCase() == element.fields.month &&
        get_year(element.fields.date) == current_year){
        // console.log(element.fields.user, element.fields.amount)
          total_paid += element.fields.amount
      }
      
  })
  return (total_paid) ;
});

var get_year = ((_date)=>{
  let _year = new Date(_date)
  return _year.getFullYear()
})







































  // #6. EDITABLE TABLES

  if ($('#editableTable').length) {
    $('#editableTable').editableTableWidget();
  }

  // #7. FORM STEPS FUNCTIONALITY

  $('.step-trigger-btn').on('click', function () {
    var btn_href = $(this).attr('href');
    $('.step-trigger[href="' + btn_href + '"]').click();
    return false;
  });

  // FORM STEP CLICK
  $('.step-trigger').on('click', function () {
    var prev_trigger = $(this).prev('.step-trigger');
    if (prev_trigger.length && !prev_trigger.hasClass('active') && !prev_trigger.hasClass('complete')) return false;
    var content_id = $(this).attr('href');
    $(this).closest('.step-triggers').find('.step-trigger').removeClass('active');
    $(this).prev('.step-trigger').addClass('complete');
    $(this).addClass('active');
    $('.step-content').removeClass('active');
    $('.step-content' + content_id).addClass('active');
    return false;
  });
  // END STEPS FUNCTIONALITY


  // #8. SELECT 2 ACTIVATION

  if ($('.select2').length) {
    $('.select2').select2();
  }

  // #9. CKEDITOR ACTIVATION

  if ($('#ckeditor1').length) {
    CKEDITOR.replace('ckeditor1');
  }

  // #10. CHARTJS CHARTS http://www.chartjs.org/

  // if (typeof Chart !== 'undefined') {

  //   var fontFamily = '"Proxima Nova W01", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  //   // set defaults
  //   Chart.defaults.global.defaultFontFamily = fontFamily;
  //   Chart.defaults.global.tooltips.titleFontSize = 14;
  //   Chart.defaults.global.tooltips.titleMarginBottom = 4;
  //   Chart.defaults.global.tooltips.displayColors = false;
  //   Chart.defaults.global.tooltips.bodyFontSize = 12;
  //   Chart.defaults.global.tooltips.xPadding = 10;
  //   Chart.defaults.global.tooltips.yPadding = 8;
  //   Chart.defaults.global.animation = 0;

  //   var step = 20;

  //   // init lite line chart if element exists

  //   // init lite line chart V2 if element exists

  //   if ($("#liteLineChartV2").length) {
  //     var liteLineChartV2 = $("#liteLineChartV2");

  //     var liteLineGradientV2 = liteLineChartV2[0].getContext('2d').createLinearGradient(0, 0, 0, 100);
  //     liteLineGradientV2.addColorStop(0, 'rgba(40,97,245,0.1)');
  //     liteLineGradientV2.addColorStop(1, 'rgba(40,97,245,0)');

      

  //     var monooxide_data = [50,50,50,50,50,50,50,50,50,50,50];
  //     var methane_data = [50,50,50,50,50,50,50,50,50,50,50];
  //     var air_quality_data = [50,50,50,50,50,50,50,50,50,50,50];
  //     var hydrogen_data = [50,50,50,50,50,50,50,50,50,50,50];

  //     var get_scale = max_min(monooxide_data.concat(methane_data.concat(air_quality_data.concat(hydrogen_data))))
      
  //     var max = get_scale.get_max;
  //     var min = get_scale.get_min;

  //     var labels = ["1pm", "3pm", "6pm", "9pm", "12pm", "15pm", "18pm", "20pm", "22pm", "25pm", "27pm"]
  //     var lineTension = 0.2;

  //     // line chart data
      

  //   }

  //   setInterval(() => {

  //     var liteLineDataV2 = {
  //       labels: labels,
  //       datasets: [{
  //         label: "Carbon Mono-Oxide",
  //         fill: true,
  //         lineTension: lineTension,
  //         backgroundColor: liteLineGradientV2,
  //         borderColor: "#2861f5",
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "#2861f5",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 2,
  //         pointHoverRadius: 3,
  //         pointHoverBackgroundColor: "#FC2055",
  //         pointHoverBorderColor: "#fff",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 3,
  //         pointHitRadius: 10,
  //         data: monooxide_data,
  //         spanGaps: false
  //       },
  //       {
  //         label: "Methane",
  //         fill: true,
  //         lineTension: lineTension,
  //         backgroundColor: liteLineGradientV2,
  //         borderColor: "#5ee211",
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "#2861f5",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 2,
  //         pointHoverRadius: 3,
  //         pointHoverBackgroundColor: "#FC2055",
  //         pointHoverBorderColor: "#fff",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 3,
  //         pointHitRadius: 10,
  //         data:  methane_data,
  //         spanGaps: false
  //       },
  //       {
  //         label: "Hydrogen",
  //         fill: true,
  //         lineTension: lineTension,
  //         backgroundColor: liteLineGradientV2,
  //         borderColor: "#ff11b8",
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "#2861f5",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 2,
  //         pointHoverRadius: 3,
  //         pointHoverBackgroundColor: "#FC2055",
  //         pointHoverBorderColor: "#fff",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 3,
  //         pointHitRadius: 10,
  //         data: hydrogen_data,
  //         spanGaps: false
  //       },
  //       {
  //         label: "Air Quality",
  //         fill: true,
  //         lineTension: lineTension,
  //         backgroundColor: liteLineGradientV2,
  //         borderColor: "#fd7e14",
  //         borderCapStyle: 'butt',
  //         borderDash: [],
  //         borderDashOffset: 0.0,
  //         borderJoinStyle: 'miter',
  //         pointBorderColor: "#2861f5",
  //         pointBackgroundColor: "#fff",
  //         pointBorderWidth: 2,
  //         pointHoverRadius: 3,
  //         pointHoverBackgroundColor: "#FC2055",
  //         pointHoverBorderColor: "#fff",
  //         pointHoverBorderWidth: 2,
  //         pointRadius: 3,
  //         pointHitRadius: 10,
  //         data:  air_quality_data,
  //         spanGaps: false
  //       }]
  //     };

  //     // line chart init
  //     var myLiteLineChartV2 = new Chart(liteLineChartV2, {
  //       type: 'line',
  //       data: liteLineDataV2,
  //       options: {
  //         legend: {
  //           display: false
  //         },
  //         scales: {
  //           xAxes: [{
  //             ticks: {
  //               fontSize: '10',
  //               fontColor: '#969da5'
  //             },
  //             gridLines: {
  //               color: 'rgba(0,0,0,0.0)',
  //               zeroLineColor: 'rgba(0,0,0,0.0)'
  //             }
  //           }],
  //           yAxes: [{
  //             display: true,
  //             position: 'left',
  //             ticks: {
  //              beginAtZero: true,
  //              max: max,
  //              min: min,
  //              stepSize: step
  //             }, 
  //           }, {
  //             display: true,
  //             position: 'right',
  //             ticks: {
  //              beginAtZero: true,
  //              max: max,
  //              min: min,
  //              stepSize: step
  //             }
  //           }]
  //         }
  //       }
  //     });

  //     update_chart_data();
  //     max = max_min(monooxide_data.concat(methane_data.concat(air_quality_data.concat(hydrogen_data)))).get_max;
  //     min = max_min(monooxide_data.concat(methane_data.concat(air_quality_data.concat(hydrogen_data)))).get_min;

  //     myLiteLineChartV2.data.datasets[0].data = monooxide_data;
  //     myLiteLineChartV2.data.datasets[1].data = methane_data;
  //     myLiteLineChartV2.data.datasets[2].data = hydrogen_data;
  //     myLiteLineChartV2.data.datasets[3].data = air_quality_data;
      
  //     myLiteLineChartV2.data.labels = myLiteLineChartV2.data.labels = 
  //     myLiteLineChartV2.data.labels = myLiteLineChartV2.data.labels = labels;

  //     myLiteLineChartV2.update();
  //   }, 2000);

  //   // init lite line chart V2 if element exists
  // }

  // var update_chart_data = (()=>{
  //   monooxide_data = [];
  //   methane_data = [];
  //   hydrogen_data = [];
  //   air_quality_data = [];
  //   labels = [];

  //   for (let index = 0; index < 10; index++) {

  //       labels.push(dataSet[index][0]);
  //       monooxide_data.push(dataSet[index][2]);
  //       methane_data.push(dataSet[index][3]);
  //       air_quality_data.push(dataSet[index][4]);
  //       hydrogen_data.push(dataSet[index][5]);

     
  //  }
  // })

  // function max_min (arrays){
  //   let get_max = parseInt((Math.max(...arrays)/step))*step+step;// get value and add extra step as buffer for graph result so that points do not start at the edge of graph.
  //   let get_min = parseInt((Math.min(...arrays)/step))*step-step;
  // //   console.log( {"get_max":get_max, "get_min":get_min, "arrays":arrays })
  //   return {"get_max":get_max, "get_min":get_min };
  // }







  // #11. MENU RELATED STUFF

  // INIT MOBILE MENU TRIGGER BUTTON
  $('.mobile-menu-trigger').on('click', function () {
    $('.menu-mobile .menu-and-user').slideToggle(200, 'swing');
    return false;
  });

  os_init_sub_menus();

  // #12. CONTENT SIDE PANEL TOGGLER

  $('.content-panel-toggler, .content-panel-close, .content-panel-open').on('click', function () {
    $('.all-wrapper').toggleClass('content-panel-active');
  });

  // #13. EMAIL APP 

  $('.more-messages').on('click', function () {
    $(this).hide();
    $('.older-pack').slideDown(100);
    $('.aec-full-message-w.show-pack').removeClass('show-pack');
    return false;
  });

  $('.ae-list').perfectScrollbar({ wheelPropagation: true });

  $('.ae-list .ae-item').on('click', function () {
    $('.ae-item.active').removeClass('active');
    $(this).addClass('active');
    return false;
  });

  // CKEDITOR ACTIVATION FOR MAIL REPLY
  if (typeof CKEDITOR !== 'undefined') {
    CKEDITOR.disableAutoInline = true;
    if ($('#ckeditorEmail').length) {
      CKEDITOR.config.uiColor = '#ffffff';
      CKEDITOR.config.toolbar = [['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-', 'About']];
      CKEDITOR.config.height = 110;
      CKEDITOR.replace('ckeditor1');
    }
  }

  // EMAIL SIDEBAR MENU TOGGLER
  $('.ae-side-menu-toggler').on('click', function () {
    $('.app-email-w').toggleClass('compact-side-menu');
  });

  // EMAIL MOBILE SHOW MESSAGE
  $('.ae-item').on('click', function () {
    $('.app-email-w').addClass('forse-show-content');
  });

  if ($('.app-email-w').length) {
    if (is_display_type('phone') || is_display_type('tablet')) {
      $('.app-email-w').addClass('compact-side-menu');
    }
  }

  // #14. FULL CHAT APP
  function add_full_chat_message($input) {
    $('.chat-content').append('<div class="chat-message self"><div class="chat-message-content-w"><div class="chat-message-content">' + $input.val() + '</div></div><div class="chat-message-date">1:23pm</div><div class="chat-message-avatar"><img alt="" src="img/avatar1.jpg"></div></div>');
    $input.val('');
    var $messages_w = $('.chat-content-w');
    $messages_w.scrollTop($messages_w[0].scrollHeight);
  }

  $('.chat-btn a').on('click', function () {
    add_full_chat_message($('.chat-input input'));
    return false;
  });
  $('.chat-input input').on('keypress', function (e) {
    if (e.which == 13) {
      add_full_chat_message($(this));
      return false;
    }
  });

  // #15. CRM PIPELINE
  if ($('.pipeline').length) {
    // INIT DRAG AND DROP FOR PIPELINE ITEMS
    var dragulaObj = dragula($('.pipeline-body').toArray(), {}).on('drag', function () {}).on('drop', function (el) {}).on('over', function (el, container) {
      $(container).closest('.pipeline-body').addClass('over');
    }).on('out', function (el, container, source) {

      var new_pipeline_body = $(container).closest('.pipeline-body');
      new_pipeline_body.removeClass('over');
      var old_pipeline_body = $(source).closest('.pipeline-body');
    });
  }

  // #16. OUR OWN CUSTOM DROPDOWNS 
  $('.os-dropdown-trigger').on('mouseenter', function () {
    $(this).addClass('over');
  });
  $('.os-dropdown-trigger').on('mouseleave', function () {
    $(this).removeClass('over');
  });

  // #17. BOOTSTRAP RELATED JS ACTIVATIONS

  // - Activate tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // - Activate popovers
  $('[data-toggle="popover"]').popover();

  // #18. TODO Application

  // Tasks foldable trigger
  $('.tasks-header-toggler').on('click', function () {
    $(this).closest('.tasks-section').find('.tasks-list-w').slideToggle(100);
    return false;
  });

  // Sidebar Sections foldable trigger
  $('.todo-sidebar-section-toggle').on('click', function () {
    $(this).closest('.todo-sidebar-section').find('.todo-sidebar-section-contents').slideToggle(100);
    return false;
  });

  // Sidebar Sub Sections foldable trigger
  $('.todo-sidebar-section-sub-section-toggler').on('click', function () {
    $(this).closest('.todo-sidebar-section-sub-section').find('.todo-sidebar-section-sub-section-content').slideToggle(100);
    return false;
  });

  // Drag init
  if ($('.tasks-list').length) {
    // INIT DRAG AND DROP FOR Todo Tasks
    var dragulaTasksObj = dragula($('.tasks-list').toArray(), {
      moves: function moves(el, container, handle) {
        return handle.classList.contains('drag-handle');
      }
    }).on('drag', function () {}).on('drop', function (el) {}).on('over', function (el, container) {
      $(container).closest('.tasks-list').addClass('over');
    }).on('out', function (el, container, source) {

      var new_pipeline_body = $(container).closest('.tasks-list');
      new_pipeline_body.removeClass('over');
      var old_pipeline_body = $(source).closest('.tasks-list');
    });
  }

  // Task actions init

  // Complete/Done
  $('.task-btn-done').on('click', function () {
    $(this).closest('.draggable-task').toggleClass('complete');
    return false;
  });

  // Favorite/star
  $('.task-btn-star').on('click', function () {
    $(this).closest('.draggable-task').toggleClass('favorite');
    return false;
  });

  // Delete
  var timeoutDeleteTask;
  $('.task-btn-delete').on('click', function () {
    if (confirm('Are you sure you want to delete this task?')) {
      var $task_to_remove = $(this).closest('.draggable-task');
      $task_to_remove.addClass('pre-removed');
      $task_to_remove.append('<a href="#" class="task-btn-undelete">Undo Delete</a>');
      timeoutDeleteTask = setTimeout(function () {
        $task_to_remove.slideUp(300, function () {
          $(this).remove();
        });
      }, 5000);
    }
    return false;
  });

  $('.tasks-list').on('click', '.task-btn-undelete', function () {
    $(this).closest('.draggable-task').removeClass('pre-removed');
    $(this).remove();
    if (typeof timeoutDeleteTask !== 'undefined') {
      clearTimeout(timeoutDeleteTask);
    }
    return false;
  });

  // #19. Fancy Selector
  $('.fs-selector-trigger').on('click', function () {
    $(this).closest('.fancy-selector-w').toggleClass('opened');
  });

  // #20. SUPPORT SERVICE

  $('.close-ticket-info').on('click', function () {
    $('.support-ticket-content-w').addClass('folded-info').removeClass('force-show-folded-info');
    return false;
  });

  $('.show-ticket-info').on('click', function () {
    $('.support-ticket-content-w').removeClass('folded-info').addClass('force-show-folded-info');
    return false;
  });

  $('.support-index .support-tickets .support-ticket').on('click', function () {
    $('.support-index').addClass('show-ticket-content');
    return false;
  });

  $('.support-index .back-to-index').on('click', function () {
    $('.support-index').removeClass('show-ticket-content');
    return false;
  });

  // #21. Onboarding Screens Modal

  $('.onboarding-modal.show-on-load').modal('show');
  if ($('.onboarding-modal .onboarding-slider-w').length) {
    $('.onboarding-modal .onboarding-slider-w').slick({
      dots: true,
      infinite: false,
      adaptiveHeight: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });
    $('.onboarding-modal').on('shown.bs.modal', function (e) {
      $('.onboarding-modal .onboarding-slider-w').slick('setPosition');
    });
  }

  // #22. Colors Toggler

  $('.floated-colors-btn').on('click', function () {
    if ($('body').hasClass('color-scheme-dark')) {
      $('.menu-w').removeClass('color-scheme-dark').addClass('color-scheme-light').removeClass('selected-menu-color-bright').addClass('selected-menu-color-light');
      $(this).find('.os-toggler-w').removeClass('on');
    } else {
      $('.menu-w, .top-bar').removeClass(function (index, className) {
        return (className.match(/(^|\s)color-scheme-\S+/g) || []).join(' ');
      });
      $('.menu-w').removeClass(function (index, className) {
        return (className.match(/(^|\s)color-style-\S+/g) || []).join(' ');
      });
      $('.menu-w').addClass('color-scheme-dark').addClass('color-style-transparent').removeClass('selected-menu-color-light').addClass('selected-menu-color-bright');
      $('.top-bar').addClass('color-scheme-transparent');
      $(this).find('.os-toggler-w').addClass('on');
    }
    $('body').toggleClass('color-scheme-dark');
    return false;
  });

  // #23. Autosuggest Search
  $('.autosuggest-search-activator').on('click', function () {
    var search_offset = $(this).offset();
    // If input field is in the activator - show on top of it
    if ($(this).find('input[type="text"]')) {
      search_offset = $(this).find('input[type="text"]').offset();
    }
    var search_field_position_left = search_offset.left;
    var search_field_position_top = search_offset.top;
    $('.search-with-suggestions-w').css('left', search_field_position_left).css('top', search_field_position_top).addClass('over-search-field').fadeIn(300).find('.search-suggest-input').focus();
    return false;
  });

  $('.search-suggest-input').on('keydown', function (e) {

    // Close if ESC was pressed
    if (e.which == 27) {
      $('.search-with-suggestions-w').fadeOut();
    }

    // Backspace/Delete pressed
    if (e.which == 46 || e.which == 8) {
      // This is a test code, remove when in real life usage
      $('.search-with-suggestions-w .ssg-item:last-child').show();
      $('.search-with-suggestions-w .ssg-items.ssg-items-blocks').show();
      $('.ssg-nothing-found').hide();
    }

    // Imitate item removal on search, test code
    if (e.which != 27 && e.which != 8 && e.which != 46) {
      // This is a test code, remove when in real life usage
      $('.search-with-suggestions-w .ssg-item:last-child').hide();
      $('.search-with-suggestions-w .ssg-items.ssg-items-blocks').hide();
      $('.ssg-nothing-found').show();
    }
  });

  $('.close-search-suggestions').on('click', function () {
    $('.search-with-suggestions-w').fadeOut();
    return false;
  });

  // #24. Element Actions
  $('.element-action-fold').on('click', function () {
    var $wrapper = $(this).closest('.element-wrapper');
    $wrapper.find('.element-box-tp, .element-box').toggle(0);
    var $icon = $(this).find('i');

    if ($wrapper.hasClass('folded')) {
      $icon.removeClass('os-icon-plus-circle').addClass('os-icon-minus-circle');
      $wrapper.removeClass('folded');
    } else {
      $icon.removeClass('os-icon-minus-circle').addClass('os-icon-plus-circle');
      $wrapper.addClass('folded');
    }
    return false;
  });
});

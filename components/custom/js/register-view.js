Polymer({
      ready:function(){

       // this.$.ajaxSubmithouse.params = {'house_id':localStorage.house_id};
        // this.$.updateTask.headers = auth;
        // this.$.deleteTask.headers = auth;
        // this.$.addTask.headers = auth;

        //users
        this.users = [];

        console.log(this.users);
      },
      submit:function(){
        console.log('users', this.users);
      },
      SubmitHouse:function(){
        console.log(this.housename);
        this.$.addHouse.url = 'http://localhost:3000/api/houses/';
        this.$.addHouse.params = {
        'house[name]':this.housename,
        'house[password]':this.housepassword,
        'house[password_confirmation]': this.housepassword
        };

        this.$.addHouse.go();
      },
      houseAdded:function(sender, detail, event) {
         localStorage.token     = detail.response[0].apikey;
         localStorage.house_id  = detail.response[0].house_id;

        this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});
        this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});

        console.log(this.users);

         this.$.pages.selected = 1;
      },
      addUsersToHouse:function(event, detail, sender) {

       this.$.addUsers.url = 'http://localhost:3000/api/users/';
       var auth = {'Authorization': 'Token token='+localStorage.token};
       this.$.addUsers.headers = auth;

       this.$.addUsers.body = {"users" : {"name": "tjerk", "email" : "tjerk.dijkstra@gmail.com"} };
       this.$.addUsers.go();

      },
      addNewUser:function() {
         this.users.push({'name':'', 'email':'', 'house_id' : localStorage.house_id});
      }
});


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

       var img = $("<img/>");
        img.attr('class', 'group-photo');

        reader.onload = function (e) {
            img.attr('src', e.target.result);
            localStorage.setItem("groupimage", e.target.result);

            $('.filebutton').html(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// $(function() {

//   function readURL(input) {
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();

//            var img = $("<img/>");
//             img.attr('class', 'group-photo');

//             reader.onload = function (e) {
//                 img.attr('src', e.target.result);
//                 localStorage.setItem("groupimage", e.target.result);

//                 $('.filebutton').html(img);
//             }

//             reader.readAsDataURL(input.files[0]);
//         }
//     }

//     $(".file").change(function(){
//         readURL(this);
//     });

//     $( '.file-form' )
//       .submit( function( e ) {
//         $.ajax( {
//           url: 'http://localhost:3000/api/houses/',
//           type: 'POST',
//           data: new FormData( this ),
//           processData: false,
//           contentType: false
//         }).done(function(data){
//             localStorage.setItem("house_id", data[0].house_id);
//             localStorage.setItem("apikey", data[0].apikey);
//         });
//         e.preventDefault();
//       });

//      $('.house_id').val(localStorage.getItem("house_id"));

//      $( '.user-form' ).submit( function( e ) {

//         e.preventDefault();
//         var users =  $(".user-form").serialize();

//         $.ajax( {
//           url: 'http://localhost:3000/api/users/',
//           type: 'POST',
//           data: users,
//           headers: {
//             "Authorization":"Token token="+localStorage.getItem("apikey")+""
//           }
//         }).done(function(data){
//             console.log(data);
//         });


//       });


//     //var groupname = localStorage.groupname || "Huisnaam";
//     //$('.groupname').text('Welkom, '+groupname+'');

//     $('.add_user').click(function(e){
//         e.preventDefault();

//         var current_count = 0;

//         var allInputsFilled = $("[class='user-form']").filter(function () {
//           inputs = $(this).find("input[type=text]");

//            current_count = inputs.length / 2;
//         });

//          var input = $("<input/>");
//         input.attr('type', 'text');
//         input.attr('name', 'user['+current_count+'][name]');
//         input.attr('placeholder', 'Naam');

//          var email = $("<input/>");
//         email.attr('type', 'text');
//         email.attr('name', 'user['+current_count+'][email]');
//         email.attr('placeholder', 'Emailadres');

//         var seperator = $("<div/>");
//         seperator.attr('class' , 'seperator');

//         $('.user-form').append(seperator).append(input).append(email).append(input).append(email);

//         if ($('.user-form').height() > 350 ){
//           $('.long-footer').addClass('no-fixed');
//         }

//     });


//     $('a').on('click, touchstart', function(){
//       var href = $(this).attr('href');
//       window.location = href;
//       return false;
//     });


// });

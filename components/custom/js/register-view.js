Polymer({
      ready:function(){
        this.users = [];
        this.errors = [];
      },
      SubmitHouse:function() {

        this.errors = [];

        if(this.housename == "") {
          this.errors.push({message: "Huisnaam is niet ingevuld"});
        }
        if(this.housepassword == "") {
          this.errors.push({message: "Wachtwoord is niet ingevuld"});
        }
        if(this.housepassword != this.housepassword_confirmation) {
          this.errors.push({message: "Wachtwoorden komen niet overeen"});
        }

        if(this.errors.length == 0){

          this.$.addHouse.url = 'http://localhost:3000/api/houses/';

          this.$.addHouse.params = {
          'house[name]':this.housename,
          'house[password]':this.housepassword,
          'house[password_confirmation]': this.housepassword
          };

          this.$.addHouse.go();
        }
      },
      houseAdded:function(sender, detail, event) {

        if(detail.response[0].apikey) {
          localStorage.token     = detail.response[0].apikey;
          localStorage.house_id  = detail.response[0].house_id;

          this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});
          this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});

          this.$.pages.selected = 1;
        } else {
          this.errors.push({message: "Huisnaam is al in gebruik"});
          this.$.pages.selected = 0;
        }
      },
      addUsersToHouse:function(event, detail, sender) {
       this.$.addUsers.url = 'http://localhost:3000/api/houses/1';
       this.$.addUsers.params = {"house": {"users_attributes": [this.users]}}

       this.$.addUsers.go();
      },
      addNewUser:function() {
         this.users.push({'name':'', 'email':'', 'house_id' : localStorage.house_id});
      },
      submitUsers:function(){

        obj = {};

        for(var i = 0; i < this.users.length; i++){
          obj['house[users_attributes]['+i+'][name]'] = this.users[i]['name'];
          obj['house[users_attributes]['+i+'][email]'] = this.users[i]['email'];
          obj['house[users_attributes]['+i+'][house_id]'] = this.users[i]['house_id'];
        }

        this.$.addUsers.url = 'http://localhost:3000/api/houses/'+localStorage.house_id;
        this.$.addUsers.params = obj;

        this.$.addUsers.go();
      },
      goToLogin:function() {
        this.fire('go-to', {page:'login'});
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


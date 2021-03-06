Polymer({
      ready:function(){
        this.users = [];
        this.errors = [];
        this.housename = "";
        this.housepassword = "";
        this.housepassword_confirmation = "";
        this.uploadMessage = "Selecteer een afbeelding";
        //this.domain = "http://localhost:3000";
        this.domain = "http://178.62.205.200";
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

          this.$.addHouse.url = this.domain+'/api/houses/';
          this.$.addHouse.params = {
          'house[name]':this.housename,
          'house[password]':this.housepassword,
          'house[password_confirmation]': this.housepassword
          };

          //this.$.pages.selected = 1;
          this.$.addHouse.go();
        }
      },
      houseAdded:function(sender, detail, event) {

        if(detail.response[0].apikey) {

          //localStorage.token     = detail.response[0].apikey;
          //localStorage.house_id  = detail.response[0].house_id;

          this.token     = detail.response[0].apikey;
          this.house_id  = detail.response[0].house_id;


          this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});
          this.users.push({'name':'', 'email':'', 'house_id' : detail.response[0].house_id});

          this.$.pages.selected = 1;

        } else {
          this.errors.push({message: "Huisnaam is al in gebruik"});
          this.$.pages.selected = 0;
        }
      },
      addNewUser:function() {
         this.users.push({'name':'', 'email':'', 'house_id' : this.house_id});
      },
      submitUsers:function(){

        obj = {};

        for(var i = 0; i < this.users.length; i++){
          obj['house[users_attributes]['+i+'][name]'] = this.users[i]['name'];
          obj['house[users_attributes]['+i+'][email]'] = this.users[i]['email'];
          obj['house[users_attributes]['+i+'][house_id]'] = this.users[i]['house_id'];
        }

 				this.$.addUsers.headers = {'Authorization':'Token token='+this.token};
        this.$.addUsers.url = this.domain+'/api/houses/'+this.house_id;
        this.$.addUsers.params = obj;

        this.$.addUsers.go();
      },
      back:function(){
        var current_page = this.$.pages.selected;

        if(current_page > 0) {
          this.$.pages.selected = current_page - 1;
        } else {
          this.fire('go-to', {page:'login'});
        }
      },
      readFile:function() {
        this.uploadMessage = "Afbeelding geselecteerd";
      },
      usersAdded:function(){
        that = this;

        swal({
          title:'Huis aangemaakt',
          text:'Iedereen is uitgenodigd!',
          showCancelButton:false,
          confirmButtonColor:"#DC5957",
          confirmButtonText:'Aan de slag!',
          closeOnConfirm:true
          }, function(){
            that.fire('go-to', {page:'login'});
            location.reload();
          });

      }
});


Polymer({
	ready:function(){
		if(localStorage.token && !localStorage.user_id){
			this.loadUsers();
			this.$.pages.selected = 1;
		}
	  	//this.domain = "http://localhost:3000";
      this.domain = "http://178.62.205.200";
	},
	login:function(){
		var name = this.$.housename.value;
		var pass = this.$.password.value;

	  //local
	  this.$.ajaxLogin.url = this.domain+'/api/sessions';
		//this.$.ajaxLogin.params = {'house[name]': 'Test', 'house[password]': 'test'};

	  //live
	  this.$.ajaxLogin.params = {'house[name]': name, 'house[password]': pass};

		this.$.ajaxLogin.go();
	},
	houseLoggedIn:function(){
		var house  = JSON.parse(this.$.ajaxLogin.response)[0];
          var apikey = JSON.parse(this.$.ajaxLogin.response)[1];

          if(JSON.parse(this.$.ajaxLogin.response) == "Geen geldige gegevens"){
              that = this;

              swal({
                title:'Geen geldige gegevens',
                text:'',
                type:'error'
                });

          }else{
              localStorage.house_id = house.id; //response.apikey[0].house_id;
              localStorage.groupName =  house.name;
              localStorage.token = apikey.access_token;
              this.loadUsers();
          }
	},
	loadUsers:function(){
        if(!localStorage.users){
            this.$.ajaxGetUsers.url = this.domain+'/api/houses/habitants/'+localStorage.house_id;
            this.$.ajaxGetUsers.headers = {'Authorization':'Token token='+localStorage.token};
            this.$.ajaxGetUsers.go();
        }else{
            this.usersLoaded();
        }
	},
	usersLoaded:function(event, detail, sender){
		if (detail) {
        this.users = detail.response;
        localStorage.users = JSON.stringify(this.users);
        console.log('users loaded first time');

        console.log(localStorage.users);
    }else{
        this.users = JSON.parse(localStorage.users);
    }

		this.$.pages.selected = 1;
	},
	goToTasks:function(event, detail, sender){
		if (detail) localStorage.user_id = detail.user_id;
        this.fire('goto-tasks');
	},
    register:function(event, detail, sender) {
        Polymer.import(['components/custom/register-view.html']);
        this.fire('go-to', {page:'register'});
    }
});

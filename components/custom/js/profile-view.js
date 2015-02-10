Polymer({
  rootChanged:function(){

      this.$.ajaxUploadAvatar.headers = this.root.auth;
      this.toolbarname = this.root.me.name;
      //add button animation
      rotate = new CoreAnimation();
      rotate.duration = 300;
      rotate.fill = 'forwards';
      rotate.target = this.$.addBtn;

    },
    selectAvatar:function(event){
        if(event.target.files[0]){
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);

            files = event.target.files;
            file = event.target.files[0];
            type = event.target.files[0].type;

            that = this;
            reader.onload = function(e){
                //that.root.me.avatar = e.target.result;
                that.processAvatar(file);
            };
        }
    },
    processAvatar:function(file){
        var data = new FormData();
        data.append('image', file);

		this.fire('toggle-loading',{set:'show'});

        that = this;

        $.ajax({
            url: this.root.domain+'/api/users/upload/'+this.root.me.id,
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR) {
                if (typeof data.error === 'undefined') {

          			var timestamp = new Date().getTime();
          			//that.root.me.profilepicture = that.root.me.profilepicture+'?update=' + timestamp;

                    that.root.me.avatar = data.avatar;
                    console.log(that.root.me.avatar);

                    //localStorage.clear(that.root.users);
                    localStorage.users = JSON.stringify(that.root.users);

					that.fire('toggle-loading',{set:'hide'});
                }
            }
        });
    },
    updateUsernameBackUp:function(){
        this.usernameBackUp = this.root.me.name.toString();
    },
    updateUsername:function(){
        if(this.usernameBackUp != this.root.me.name){
            this.usernameUpdated();
        }
    },
    usernameUpdated:function(){
        swal({
          title:'Gebruikersnaam gewijzigd',
          //text:'Weet je zeker dat je van gebruiker wilt wisselen?',
          type:'success',
          confirmButtonColor:"#DC5957",
          confirmButtonText:'Dank je',
      }, function(){

      });
    },
  showTakskManager:function(){
      this.toolbarname = 'Taakbeheer';
      this.$.pages.selected = 0;
      this.$.addBtn.hidden = false;
  },
  showUsersManager:function(){
      this.toolbarname = 'Gebruikers';
      this.$.pages.selected = 2;
      this.$.addBtn.hidden = true;
  },
  editUser:function(sender, detail, event){
      this.editUser = detail.id;
      this.editUsername = detail.username;
      //this.$.pages.selected = 3;
  },
  updateUser:function(){

  },
  switchUser:function(){
      swal({
          title:'Gebruiker wisselen',
          text:'Weet je zeker dat je van gebruiker wilt wisselen?',
          //type:'warning',
          showCancelButton:true,
          cancelButtonText:'Nee',
          confirmButtonColor:"#DC5957",
          confirmButtonText:'Ja',
          closeOnConfirm:false,
		  imageUrl:'/images/alerts/warning.jpg',
		  imageSize:'120x120'
      }, function(){
          localStorage.removeItem('user_id');
          location.reload();
      });
  },
  logOut:function(){
      swal({
          title:'Uitloggen',
          text:'Weet je zeker dat je wilt uitloggen?',
          //type:'warning',
          showCancelButton:true,
          cancelButtonText:'Nee',
          confirmButtonColor:"#DC5957",
          confirmButtonText:'Ja',
          closeOnConfirm:false,
		  imageUrl:'/images/alerts/warning.jpg',
		  imageSize:'120x120'
      }, function(){
          localStorage.clear();
          location.reload();
      });
  },
  goBack:function(){
      this.fire('go-to', {page:'tasks'});
  }
});



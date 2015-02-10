Polymer({
	ready:function(){
        root = {};

		if(localStorage.house_id && localStorage.token && localStorage.user_id){
            this.loadRoot();
		}else{
            this.$.login.opened = true;
		}
	},
	goTo:function(event, detail, sender){
        sender.parentElement.opened = false;

        document.querySelector('html /deep/ #'+detail.page).opened = true;
    },
    loadRoot:function(){
        //close login-form if open
        this.$.login.opened = false;


        //api domain
        var domain = 'http://178.62.205.200';
        //var domain = 'http://localhost:3000';
        root['domain'] = domain;

        //authorization
        var auth = {'Authorization': 'Token token='+localStorage.token};
        root['auth'] = auth;

        //house ID
        root['house'] = localStorage.house_id;

        //users
        root['users'] = JSON.parse(localStorage.users);

        //current user
        var me = root.users.filter(function(obj){
            return obj.id == localStorage.user_id;
        });
        me[0]['points'] = 0;

        root['me'] = me[0];


        this.$.ajaxGetAvatar.headers = auth;
        this.$.ajaxGetAvatar.url = domain+'/api/users/avatar/'+me[0].id;
        this.$.ajaxGetAvatar.go();

        //tasks
        root['tasks'] = [];
        this.loadTasks(root.auth, root.domain, root.house);
    },
	tasksError:function(){
		swal({
          title:'Oeps, er ging iets fout!',
          //type:'warning',
          confirmButtonColor:"#DC5957",
          confirmButtonText:'Opnieuw inloggen',
          closeOnConfirm:false,
		  imageUrl:'/images/alerts/warning.jpg',
		  imageSize:'120x120'
      }, function(){
          localStorage.clear();
          location.reload();
      });
	},
    loadTasks:function(auth, domain, house){
		this.toggleLoading('',{set:'show'});

        this.$.ajaxGetTasks.headers = auth;
        this.$.ajaxGetTasks.url = domain+'/api/tasks';
        this.$.ajaxGetTasks.params = {'house_id':house};
        this.$.ajaxGetTasks.go();
    },
    avatarLoaded:function(sender, detail, event) {
        root.me['profilepicture'] = 'http://178.62.205.200/'+detail.response.avatar;
    },
    tasksLoaded:function(sender, detail, event){
        if(!root){
			root = this.root;
			this.root = {};
		}
		
		root['tasks'] = detail.response.sort(this.sortTasks);
        this.root = root;

        this.$.tasks.opened = true;

		this.toggleLoading('',{set:'hide'});
	},
    reloadTasks:function(){
        this.loadTasks(root.auth, root.domain, root.house);
    },
	sortTasks:function(a,b){
        var a_name = a.name.toUpperCase();
        var b_name = b.name.toUpperCase();

        if (a_name < b_name){
            return -1;
        }else if (a_name > b_name){
            return 1;
        }else{
            return 0;
        }
    },
	toggleLoading:function(sender, detail, event){
		loadingscreen = this.$.loadingscreen;

		if(loadingscreen.hidden == true && detail.set == 'show'){
			loadingscreen.hidden = false;
		}else{
			setTimeout(function(){
				loadingscreen.hidden = true;
			}, 500);
		}
	}
});

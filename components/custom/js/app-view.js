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

        console.log(root['users']);

        //current user
        var me = root.users.filter(function(obj){
            return obj.id == localStorage.user_id;
        });
        me[0]['points'] = 0;
        root['me'] = me[0];

        //tasks
        root['tasks'] = [];
        this.loadTasks(root.auth, root.domain, root.house);
    },
    loadTasks:function(auth, domain, house){
        this.$.ajaxGetTasks.headers = auth;
        this.$.ajaxGetTasks.url = domain+'/api/tasks';
        this.$.ajaxGetTasks.params = {'house_id':house};
        this.$.ajaxGetTasks.go();
    },
    tasksLoaded:function(sender, detail, event){
        root['tasks'] = detail.response;
        this.root = root;

        this.$.tasks.opened = true;
    },
    reloadTasks:function(){
        this.loadTasks(root.auth, root.domain, root.house);
    }
});

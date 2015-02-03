Polymer({
	ready:function(){
		if(localStorage.house_id && localStorage.token && localStorage.user_id){
            this.loadTasks();
		}else{
            this.$.login.opened = true;
		}
	},
	goTo:function(event, detail, sender){
        sender.parentElement.opened = false;
        
        document.querySelector('html /deep/ #'+detail.page).opened = true;
    },
    loadTasks:function(){
        this.$.login.opened = false;
        
        var auth = {'Authorization': 'Token token='+localStorage.token};
        this.$.ajaxGetTasks.headers = auth;
        this.$.ajaxGetTasks.url = "http://178.62.205.200/api/tasks";
        this.$.ajaxGetTasks.params = {'house_id':localStorage.house_id};
        this.$.ajaxGetTasks.go();
    },
    tasksLoaded:function(sender, detail, event){
        this.tasks = JSON.stringify(detail.response);
        this.$.tasks.opened = true;
    },
    reloadTasks:function(){
        this.loadTasks();
    }
});
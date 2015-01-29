Polymer({
	ready:function(){
		if(localStorage.house_id && localStorage.token && localStorage.user_id){
			Polymer.import(['components/custom/tasks-view.html']);
            this.$.tasks.opened = true;
		}else{
			Polymer.import(['components/custom/login-profiles.html']);
            this.$.login.opened = true;
		}
	},
	goTo:function(event, detail, sender){
		
        sender.parentElement.opened = false;
        
        document.querySelector('html /deep/ #'+detail.page).opened = true;
                        
        /*if(detail.page == 'settings-view'){
            this.$.settings.opened = true;
            this.$.tasks.opened = false;
        
        }else{
            //this.$.settings.opened = false;
            sender.hidden = true;
		    document.querySelector('html /deep/ '+detail.page).hidden = false;
		    document.querySelector('html /deep/ tasks-view').start = 'true';
        }
        
         if(detail.page != 'register-view'){
          document.querySelector('html /deep/ tasks-view').start = 'true';
        }*/
		}
});
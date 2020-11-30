import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {BlazeLayout} from "meteor/kadira:blaze-layout";

import '/imports/ui/layouts/default';


FlowRouter.route('/', {
  name: 'dashboard',
  action(params, queryParams) {
    import '/imports/ui/pages/dashboard/dashboard';
		BlazeLayout.render("default", {content: "dashboard"});
  }
});

FlowRouter.route('/pageScraper', {
  name: 'pageScraper',
  action(params, queryParams) {
    import '/imports/ui/pages/pageScraper/pageScraper';
		BlazeLayout.render("default", {content: "pageScraper"});
  }
});
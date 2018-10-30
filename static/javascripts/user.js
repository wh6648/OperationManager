

$(function () {
  "use strict";

  function events() {

  }

  function render() {
    var tmplUser = $("#tmplUser").html()
      , listdata = $("#listdata");

    light.doget("/user/list", {}, function(err, result) {
      _.each(result.items, function(item) {
        listdata.append(_.template(tmplUser, item));
      })
    });
  }

  events();
  render();
});

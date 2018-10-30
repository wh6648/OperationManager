$(function() {

    events();
    render();

    function events() {

        /* Custom jQuery for the example */
        $("#show-list").click(function(e){
            e.preventDefault();

            $('#list-html').toggle('fast', function(){
                if($(this).is(':visible')){
                    $('#show-list').text('Hide underlying list.');
                    $(".topbar").fadeTo('fast',0.9);
                }else{
                    $('#show-list').text('Show underlying list.');
                    $(".topbar").fadeTo('fast',1);
                }
            });
        });

        $("#org").bind("DOMSubtreeModified", function() {
            $('#list-html').text('');

            $('#list-html').text($('#org').html());

        });

    }

    function  render() {

        $("#org").jOrgChart({
            chartElement : '#chart',
            dragAndDrop  : true
        });

        $('#list-html').text($('#org').html());
    }

});
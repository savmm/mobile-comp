(function ($) {

    var shade = "#556b2f";

    $.fn.stTextArea = function (options) {
        var parentHeight, textAreaHeight;

        if (options.fillParent == "true") {
            $(this).css("height", "100%");
        }

        if (options.fillParent == "false") {
            $(this).on('keypress', function (event) {

                if (event.keyCode == 13) {
                        $(this).prop("rows", $(this).prop("rows") + 1);
                }
            });
              $(this).on('keydown', function (event) {
           
                if (event.keyCode == 8)  {
                        $(this).prop("rows", $(this).prop("rows") -1 );
                      $(this).css( "height",  $(this).prop("rows")* $(this).css("line-height"));
                    }

                
            });
        }

        return  $(this);
    };

}(jQuery));
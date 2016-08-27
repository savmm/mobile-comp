(function($) {
       function startTrigger(e,data) {
           var $elem = $(this);
           $elem.data('mouseheld_timeout', setTimeout(function() {
               $elem.trigger('mouseheld');
           }, e.data));
       }

       function stopTrigger() {
           var $elem = $(this);
           clearTimeout($elem.data('mouseheld_timeout'));
       }

       var mouseheld = $.event.special.mouseheld = {
           setup: function(data) {
               var $this = $(this);
               $this.bind('touchstart', +data || mouseheld.time, startTrigger);
               $this.bind('touchend touchmove', stopTrigger);
           },
           teardown: function() {
               var $this = $(this);
               $this.unbind('touchstart', startTrigger);
               $this.unbind('touchend touchmove', stopTrigger);
           },
           time: 750 // default to 750ms
       };
   })(jQuery);

/**
 * Native-like menu Drawer 
 * Depends on Hammer.js 
 * for smooth touch handeling
 * 
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 */

// set global variables needed for proper drawer functioning
var swipe, swipeH, body, bodyH, 
    drawer, drawerH, drawerDimm, drawerDimmH, 
    navToggle, deviceW, viewContent,
    burger, burgerTop, burgerBottom,
    topbarH, refEl;
//

angular.module('nlFramework', [])
.factory('$nlConfig', function(){
  return {
    open: false,
    plusActive: false,
    holdPos: null,
    reverse: false,
    scroll: {},
    nlRefresh: {},
    options: {
      maxWidth: 300,
      topBarHeight: 0,
      speed: 0.2,
      animation: 'ease',
      modifyViewContent: false,
      useActionButton: false,
      useRefresh: true,
      burger: {
        endY: 6,
        startScale: 1,
        endScale: 0.7
      }
    }
  }
})
.factory('$nlBurger', [ '$nlConfig', '$nlHelpers', function($nlConfig, $nlHelpers){
  return {
    animate: function( pos ){
      var total = $nlConfig.maxWidth;
      var current = total - Math.abs(pos);
      var currentPerc = Math.floor( (100/total)*current);
      if( currentPerc > 0 ){
        //
        //var currentWidth = $nlConfig.options.burger.startWidth - Math.floor(((6/100)*currentPerc));
        var scale = $nlConfig.options.burger.startScale - Math.abs((((1-$nlConfig.options.burger.endScale)/100)*currentPerc)).toFixed(2);
        // for both lines
        var rotate = Math.floor(((45/100)*currentPerc));
        var y_pos_top = Math.floor((($nlConfig.options.burger.endY/100)*currentPerc));
            y_pos_top = y_pos_bottom = y_pos_top < $nlConfig.options.burger.endY ? y_pos_top : $nlConfig.options.burger.endY;
        // Complete burger rotation
        var rotateComplete = Math.floor(((180/100)*currentPerc));
        //
        if( $nlConfig.options.reverse ){
          rotateComplete = 180+(180-rotateComplete);
        }
        //
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        //
        $nlHelpers.translate( burger, 0, '', 0, '', rotateComplete, '', '' );
        $nlHelpers.translate( burgerTop, 0, '', y_pos_top, '', rotate, '', '', scale );
        $nlHelpers.translate( burgerBottom, 0, '', y_pos_bottom, '-', rotate, '-', '', scale );
      }
    },
    toggle: function( toggle ){
      // set transitions length for animation
      burger.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      burgerTop.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      burgerBottom.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      //
      if(toggle){
        // ON
        $nlHelpers.translate( burgerTop, 0, '', $nlConfig.options.burger.endY, '', 45, '', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( burgerBottom, 0, '', $nlConfig.options.burger.endY, '-', 45, '-', '', $nlConfig.options.burger.endScale );
        $nlHelpers.translate( burger, 0, '', 0, '-', 180, '' );
      }else{
        // OFF
        $nlHelpers.translate( burgerTop, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        $nlHelpers.translate( burgerBottom, 0, '', 0, '', 0, '', '', $nlConfig.options.burger.startScale );
        if( $nlConfig.options.reverse ){
          $nlHelpers.translate( burger, 0, '', 0, '-', 360, '' );
        }else{
          $nlHelpers.translate( burger, 0, '', 0, '-', 0, '' );
        }
      }
      // reset burger state after the animation is done
      setTimeout( function(){
        burger.style.transition = 'none';
        burgerTop.style.transition = 'none';
        burgerBottom.style.transition = 'none';
        if(!toggle){
          $nlHelpers.translate( burger, 0, '', 0, '-', 0, '' );
          $nlConfig.options.reverse = false;
        }else{
          $nlConfig.options.reverse = true;
        }
      }, $nlConfig.options.speed*1000 );
    }
  }
}])
.factory('$nlHelpers', function(){
  return {
    translate: function(myElement, x, pmX, y, pmY, deg, pmDeg, width, scale, mozieo){
      var x = x || 0,
          y = y || 0,
          pmX = pmX || '',
          pmY = pmY || '',
          pmDeg = pmDeg || '',
          width = width || false,
          scale = scale ? 'scale3d('+scale+',1,1)' : '',
          el = myElement;
      if( el.id === 'burger-top' ){
        el.style.transformOrigin = '100% 100%';
      }else if( el.id === 'burger-bottom' ){
        el.style.transformOrigin = '100% 0%';
      }
      el.style.transform = 'translate3d('+pmX+x+'px, '+pmY+y+'px, 0) rotate3d( 0, 0, 1, '+pmDeg+deg+'deg ) ' + scale;
      el.style.webkitTransform = 'translate('+pmX+x+'px, '+pmY+y+'px) translateZ(0) rotate('+pmDeg+deg+'deg) ' + scale;
      if( width ) el.style.width = width+'px';
      if( width ) el.style['max-width'] = width+'px';
      // only for mozzila, opera and IE
      if( mozieo ) el.style.msTransform = el.style.MozTransform = el.style.OTransform = 'translateX('+pmX+x+'px) translateY('+pmY+y+'px) rotate('+pmDeg+deg+'deg)';
    },
    merge: function(obj1,obj2){
      var obj3 = {};
      for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
      for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
      return obj3;
    }
  }
})
.factory('$nlDrawer', [ '$nlConfig', '$nlBurger', '$nlHelpers', function($nlConfig, $nlBurger, $nlHelpers){
  console.log( $nlHelpers );
  var nlDrawer = {
    show: function(){
      // show drawer with animation
      drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > deviceW-56 ? deviceW-56 : $nlConfig.options.maxWidth;
      console.log($nlConfig.maxWidth);
      $nlHelpers.translate( drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
      // dimm background
      drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = '1';
      // set open state and toggle burger
      $nlConfig.options.open = true;
      $nlConfig.options.reverse = true;
      $nlBurger.toggle(true);
    },
    hide: function(){
      // hide drawer
      drawer.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '' );
      // dimm background
      drawerDimm.style.transition = 'all '+$nlConfig.options.speed+'s '+$nlConfig.options.animation;
      drawerDimm.style.visibility = 'hidden';
      drawerDimm.style.opacity = '0';
      // toggle burger
      if( $nlConfig.options.open ){
        $nlBurger.toggle(false);
      }
      // set open state
      $nlConfig.options.open = false;
    },
    toggle: function(){
      //alert('drawer.toggle()!');
      if( $nlConfig.options.open ){
        nlDrawer.hide();
      }else{
        nlDrawer.show();
      }
    },
    move: function( ev, hold ){
      // check for direction
      $nlConfig.options.direction = ev.type === 'panleft' ? 'left' : 'right';
      // figure out position, depending on wheter we are holding drawer itself somwhere in the middle
      // or just the edge
      var pos = ev.center.x - $nlConfig.maxWidth;
      if( hold ){
        $nlConfig.options.holdPos = $nlConfig.options.holdPos ? $nlConfig.options.holdPos : pos;
        pos = pos + Math.abs($nlConfig.options.holdPos);
      };
      pos = pos < 0 ? pos : 0;
      // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
      var opacityModder = $nlConfig.options.maxWidth - Math.abs(pos); 
      var opacity = ( opacityModder / ($nlConfig.options.maxWidth/100) / 100 ).toFixed(2);
          opacity = opacity < 1 ? opacity : 1;
      // animate burger menu icon
      $nlBurger.animate( pos );
      // dimm background
      drawerDimm.style.visibility = 'visible';
      drawerDimm.style.opacity = opacity;
      drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
      // move the drawer
      drawer.style.transition = 'none';
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > deviceW-56 ? deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( drawer, pos, '', 0, '', 0, '', $nlConfig.maxWidth );
      // if this is final touch (mouse move) event
      // show or hide the drawer (pannig left = open, right = close)
      // and clean our temp values
      $nlConfig.options.open = true;
      if( ev.isFinal ){
        if( $nlConfig.options.direction === 'left' ){
          nlDrawer.hide();
        }else{
          nlDrawer.show();
        }
        $nlConfig.options.holdPos = null;
        $nlConfig.options.endTrue = false;
      }else{
        $nlConfig.options.endTrue = true;
      }
    },
    touchEnd: function( element ){
      // listen for touch end event on touch devices
      var onTouchDevice = 'ontouchstart' in window ? true : false;
      if( onTouchDevice ){
        element.addEventListener('touchend', function(e){
          onEnd(e, true);
        }, false);
      }else{
        element.addEventListener('mouseup', function(e){
          onEnd(e, false);
        }, false);
      };
      var onEnd = function(e, touch){
        // get the touch reference
        // reference first touch point for this event
        var touchobj = touch ? e.changedTouches[0] : e; 
        // if the drawer is pulled more than 50% of its maxWidth
        var isBigger = touchobj.clientX > ($nlConfig.options.maxWidth/2);
        // combined with the direction
        var isLeft = $nlConfig.options.direction === 'left';
        var isRight = $nlConfig.options.direction === 'right';
        var endTrue = $nlConfig.options.endTrue;
        // decide if show or hide the drawer
        if( (isBigger && isLeft && endTrue) || (isBigger && isRight && endTrue) ){
          nlDrawer.show();
        }else if( (!isBigger && isLeft && endTrue) || (!isBigger && isRight && endTrue) ){
          nlDrawer.hide();
        }
        // clean up our temp variables
        $nlConfig.options.direction = false;
        $nlConfig.options.endTrue = false;
        $nlConfig.options.holdPos = null;
        e.preventDefault()
      }
    },
    init: function( config ){
      // get options passed from initialization and merge them with default ones
      $nlConfig.options = $nlHelpers.merge($nlConfig.options, config);
      // get references to all needed elements on page
      console.log( 'init drawer' );
        swipe = document.getElementById('swipe-stripe');
        swipeH = new Hammer(swipe);
        body = document.getElementById('cont');
        bodyH = new Hammer(body);
        drawer = document.getElementById( 'drawer' );
        drawerH = new Hammer(drawer);
        drawerDimm = document.getElementById( 'drawer-dimm' );
        drawerDimmH = new Hammer(drawerDimm);
        topbar = document.getElementById( 'topbar' );
        topbarH = new Hammer(topbar);
        // burger elements
        burger = document.getElementById( 'burger' );
        burgerTop = document.getElementById( 'burger-top' );
        burgerBottom = document.getElementById( 'burger-bottom' );
        // refresh indicator
        refEl = document.getElementById( 'nlRefresh' );
      // get device width and height for proper scaling of drawer
      deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      // modify view-content,
      // used only when the drawer is set to have offset from top (so the topbar remains visible)
      if( $nlConfig.options.modifyViewContent ){
        viewContent = document.getElementById( 'view-content' );
        viewContent.style.position = 'fixed';
        viewContent.style.width = deviceW+'px';
        viewContent.style.height = deviceH-$nlConfig.options.topBarHeight+'px';
        viewContent.style.top = $nlConfig.options.topBarHeight+'px';
      }
      // set initial styles (position and size)
      $nlConfig.maxWidth = $nlConfig.options.maxWidth > deviceW-56 ? deviceW-56 : $nlConfig.options.maxWidth;
      $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
      // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
      window.onresize = function(event) {
        deviceW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        deviceH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if( $nlConfig.options.modifyViewContent ){
          viewContent.style.position = 'fixed';
          viewContent.style.width = deviceW+'px';
          viewContent.style.height = deviceH-$nlConfig.options.topBarHeight+'px';
        }
        $nlConfig.maxWidth = $nlConfig.options.maxWidth > deviceW-56 ? deviceW-56 : $nlConfig.options.maxWidth;
        if( !$nlConfig.options.open ){
          $nlHelpers.translate( drawer, $nlConfig.maxWidth, '-', 0, '', 0, '', $nlConfig.maxWidth );
        }else{
          $nlHelpers.translate( drawer, 0, '', 0, '', 0, '', $nlConfig.maxWidth );
        }
      }
      // listen for pan events on elements
      drawerH.on("panleft panright", function( ev ){
        if( $nlConfig.options.open ) nlDrawer.move( ev, true );
      });
      drawerDimmH.on("panleft panright", function(ev) {
        if( $nlConfig.options.open ) nlDrawer.move( ev );
      });
      swipeH.on("panright panleft", function(ev) {
        nlDrawer.move( ev );
      });
      // register touch end listeners
      nlDrawer.touchEnd( swipe );
      nlDrawer.touchEnd( drawer );
      nlDrawer.touchEnd( drawerDimm );
    },
    set: function( config ){
      var oldOptions = $nlConfig.options;
      $nlConfig.options = $nlHelpers.merge(oldOptions, config);
    },
    togglePlus: function( hide ){
      // action button
      // used only if enabled in setting when initializing
      if( $nlConfig.options.useActionButton ){
        var add_panel = document.getElementById('add-panel-switch');
        var drawer_overlay = document.getElementById('drawer-dimm');
        if( !nlDrawer.plusActive && !hide ){
          nlDrawer.plusActive = true;
          add_panel.classList.add('active');
          drawer_overlay.style.visibility = 'visible';
          drawer_overlay.style.opacity = '1';
        }else{
          if( !$nlConfig.options.open ){
            drawer_overlay.style.visibility = 'hidden';
            drawer_overlay.style.opacity = '0';
          } 
          nlDrawer.plusActive = false;
          add_panel.classList.remove('active');
        }
      }
    }
  };
  return nlDrawer; 
}])
.factory('$nlRefresh', [ '$nlConfig', '$nlHelpers', function($nlConfig, $nlHelpers){
  var nlRefresh = {
    init: function(){
      $nlConfig.scroll.top = 0;
      // chech for scroll position
      window.addEventListener("scroll", function(event) {
        $nlConfig.scroll.top   = window.pageYOffset || document.documentElement.scrollTop;
        $nlConfig.scroll.left  = window.pageXOffset || document.documentElement.scrollLeft;
      }, false);

      topbarH.on("pandown panup", function( ev ){
        if( $nlConfig.scroll.top < 1 ){
          $nlConfig.nlRefresh.direction = ev.type === 'panup' ? 'up' : 'down';
          refEl.style['z-index'] = '1100';
          var end = Math.floor(deviceH/4);
          console.log( 'end', end );
          var pos = (100/deviceH) * ev.center.y;
              pos = (pos * (end/100)) + $nlConfig.options.topBarHeight;
          console.log( 'pos', pos );
          $nlHelpers.translate(refEl, 0, '', pos, '', 0, '')
        }
      });
    }
  }
  return nlRefresh;
}]);
try{Typekit.load({ async: true });}catch(e){}

var prev_infowindow = false;
var mapMarkersArray = Array();
var map;
var clusterArrayBig = Array();
var clusterMarkerArrayClean = Array();
var densityLat = 2.5;
var densityLng = 3;
densityLat = 0.003;
densityLng = 0.003;

$( window ).resize(function() {
    resizeMobileMenu();
});

$(document).ready(function(){
    createButtonHoverEffects();
    createMouseEvents();
    checkGoogleMap();
    checkIsotope();
    checkNumberAnimations();
    checkMainMenuAccordion();
    createModalLinks();
    resizeMobileMenu();
    createRecaptchaEvents();
});
function createMouseEvents(){
  //
  //  Let's initiate all mouse effects and click events
  //
  $('a[href^="tel"]').click(function(e){
      //eventCategory, eventAction, eventLabel
      trackEventF("Sitelink", "Tel", $(this).attr("href"));
  })
  $(".hover-block a, .block-products_for a").mouseover( function(e){
    var parentE = $(this).closest(".hover-block-element");
    parentE.addClass("hover");
  });
  $(".hover-block a, .block-products_for a").mouseout( function(e){
    var parentE = $(this).closest(".hover-block-element");
    parentE.removeClass("hover");
  });

  $(".filter_control a").click(function(e){
    e.preventDefault();

    var category = $(this).data("category");
    trackEventF( "Maps filter", "Filter", category);
    $(".filter_control a.selected").removeClass("selected");
    drawMarkersOnMap(category);
  });
  $(".referenceGallery a").magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    gallery:{
      enabled:true
    }
  });
  $(".header-search a").click(function(e){
    var headerSearchForm = $(".header-search-form");
    var searchTxtfield = $(".search-field-header");
    var searchTxt = searchTxtfield.val();
    if (searchTxt){
      // submit form
      $(headerSearchForm).find("form").submit();
    }else{
      var w = 0;
      var headerAlpha = 0;
      if ($(headerSearchForm).hasClass("open")){
        headerAlpha = 1;
        $(headerSearchForm).removeClass("open");
      }else{
        headerAlpha = 0;
        $(headerSearchForm).addClass("open");
        w = $(headerSearchForm).find(".search-field-header").innerWidth();
      }
      TweenMax.killTweensOf(headerSearchForm);
      TweenMax.to(headerSearchForm,0.5,{width:w,ease:Quad.easeInOut});

      var header_logo = $(".header_logo");
      TweenMax.killTweensOf(header_logo);
      TweenMax.to(header_logo,0.5,{autoAlpha:headerAlpha,ease:Linear.easeNone});
    }
  });

  $(".language-select").click(function(e){
      e.preventDefault();
      $(".location-selection-dropdown").toggleClass("open");
  });
}

function animatedNumber(obj){
  //
  //  Check if object hasn't been animated yet
  //
  if ($(obj).data("readytoanimate")==1){
    //
    // This object is now animated, let's not animate it ever again.
    $(obj).data("readytoanimate",0);
    var fromNumber      = parseInt($(obj).data("fromvalue"));
    var toNumber        = parseInt($(obj).data("tovalue"));
    var format          = $(obj).data("format");
    var animatedArray   = {value:fromNumber};
    var animatedArrayTo = {value:toNumber};
    var delay           = -Math.floor(Math.random()*2)-2;
    var duration        = 13+Math.floor(Math.random()*5);
    delay           = -Math.floor(Math.random()*1);
    duration        = Math.floor(Math.random()*2)+1+(Math.abs(delay));

    TweenMax.to(animatedArray,duration,{delay:delay, value:parseInt($(obj).data("tovalue")), ease:Expo.easeOut, onUpdate:updateNumber, onUpdateParams:[animatedArray, format, obj]})
  }
}
function updateNumber(value,format,obj){
  //
  //  TweenMax needs object to animate arrays
  //  that's why must use updateNumber-function to use injectNumberAnimValue
  //
  injectNumberAnimValue(value.value, format, obj)
}
function injectNumberAnimValue(value, format, obj){
  //
  //  Replace element content with filter ( 100% --> _% where _ character is replaced by numeric value)
  //
  $(obj).html( format.replace("_", Math.round(value) ) );
}


function animateAllNumbers(){
  $('.element-container .number').each( function(i){
    animatedNumber($(this));
  });
}
function checkNumberAnimations(){
  if ( $( ".element-container .number" ).length ){
    $(".element-container .number").each( function(i){
      var numberStr = $(this).html();
      var origNumberStr = numberStr;
      var num = numberStr.replace(/^\D+|\D+$/g, "");
      var format = origNumberStr.replace(num,"_");
      $(this).data("format",format);
      $(this).data("fromvalue",num*0.25);
      $(this).data("tovalue",num);
      //
      //  Give element a value, that we don't animate them over and over again.
      $(this).data("readytoanimate",1);
      injectNumberAnimValue(num*0.25,format,$(this));
    });

    //
    //  Animate numbers when user scrolls page
    //
    $(window).scroll(function() {
      $('.element-container .number').each( function(i){
        var isElementInViewV = isElementInView($(this));
        if (isElementInViewV){
          animateAllNumbers();
        }
      });
    });
    //
    //  Animate numbers on page loads
    //
    $('.element-container .number').each( function(i){
      var isElementInViewV = isElementInView( $(this) );
      if (isElementInViewV){
        animateAllNumbers();
      }
    });
  }
}
function isElementInView( obj ){
  //
  // check if element is in view
  //
  var windowTop = $(window).scrollTop();
  var windowBottom = windowTop + $(window).height();

  var objTop = $(obj).offset().top;
  var objBottom = objTop + $(obj).height();

  if ((objBottom <= windowBottom) && (objTop >= windowTop)){
    // fully in view
    return true;
  }
  if ((objTop < windowBottom ) && (objBottom > windowBottom)){
    // peeks at the bottom of the screen
    return true;
  };
  if ((objBottom > windowTop ) && (objTop < windowTop)){
    // peeks at the top of the screen
    return true;
  };

  return false;
}
function checkIsotope(){
  //
  //  Check if isotope element exists in DOM
  //
  if ( $( ".row.contacts.isotope" ).length ){
    var $grid = $('.row.contacts.isotope').imagesLoaded( function() {
      //
      // init Isotope after all images have loaded
      var iso = new Isotope( '.row.contacts', {
        itemSelector: '.contact-card',
        layoutMode: 'fitRows'
      });

      //
      //  Change categories
      //
      $(".filter.category a").click(function(e){
        e.preventDefault();
        $(".filter.category a.selected").removeClass("selected");
        $(this).addClass("selected");
        var filterValue = "."+$(this).data('categoryid');
        iso.arrange({ filter: filterValue });
      });

      //
      //  On page load, select the first category (which one has the predefined .selected -class)
      //
      var selectedCat = $(".filter.category a.selected");
      if ( selectedCat.length ){
        var filterValue = "."+selectedCat.data('categoryid');
        iso.arrange({ filter: filterValue });
      }
    });
  }
}
function checkGoogleMap(){
  if ( $( "#map_canvas" ).length ){
    placeGoogleMaps();
  }
}
function closeLastInfoWindow(){
  if( prev_infowindow ) {
     prev_infowindow.close();
  }
}
function createMapMarker(markerValue){
  var p = markerValue.location;
  var latlng = new google.maps.LatLng(p.lat, p.lng);

  var image = _templateUrl+"/images/map/pin_c_blue.png";
  var linkText = _txtReference;
  if (markerValue.is_casestudy){
    image = _templateUrl+"/images/map/pin_blue.png";
    linkText = _txtCaseStudy;
  }
  var contentHTML = '<div class="bubbleInfo"><strong>'+markerValue.title+'</strong>'+markerValue.description+'<div class="link">';
  if (markerValue.url){
      contentHTML +='<a href="'+markerValue.url+'">'+linkText+'</a>';
  }
  contentHTML +='</div></div>';

  var infowindow = new google.maps.InfoWindow({

    content: contentHTML
  });
  var marker = new google.maps.Marker({
      position: latlng,
      label: " ", // eg. number how many markers are in the area
      map: null,
      title: markerValue.title,
      icon: image,
  });
  marker.addListener('click', function() {
    closeLastInfoWindow();
    prev_infowindow = infowindow;
    infowindow.open(map, marker)
  });
  return marker;
}
function createClusteredMarker(markerArray, is_casestudy){

  var markerCount = ""+Math.abs(markerArray.length);
  if (markerArray.length>9){
    markerCount = "\u2026";
  }
  var realLat = 0;
  var realLng = 0;

  var contentHTML = "";
  for (i in markerArray){
    var markerValue = markerArray[i];
    var caseClass = "not_casestudy";
    var linkText = _txtReference;
    realLat += parseFloat(markerValue.location.lat);
    realLng += parseFloat(markerValue.location.lng);
    if (markerValue.is_casestudy){
      caseClass = "is_casestudy";
      linkText = _txtCaseStudy;
    }
    if (is_casestudy!=999){
      caseClass = "";
    }
    contentHTML += '<div class="bubbleInfo multipleMarkers"><strong class="'+caseClass+'">'+markerValue.title+'</strong>'+markerValue.description+'<div class="link">';
    if (markerValue.url){
        contentHTML += '<a href="'+markerValue.url+'">'+linkText+'</a>';
    }
    contentHTML += '</div></div>';
  }
  var _lat = realLat/markerCount;
  var _lng = realLng/markerCount;
  var latlng = new google.maps.LatLng(_lat, _lng);

  var infowindow = new google.maps.InfoWindow({
    content: contentHTML
  });
  var image = _templateUrl+"/images/map/pin_c_blue.png";
  if (is_casestudy==1){
    image = _templateUrl+"/images/map/pin_blue.png";
  }else if(is_casestudy==999){
    image = _templateUrl+"/images/map/pin_blue.png";
  }
  var marker = new google.maps.Marker({
      position: latlng,
      label: "", // eg. number how many markers are in the area
      map: null,
      title: markerValue.title,
      icon: image,
  });
  marker.addListener('click', function() {
    closeLastInfoWindow();
    prev_infowindow = infowindow;
    infowindow.open(map, marker)
  });
  return marker;
}
function clearMap(){
  //
  //  Clear map from placed markers
  //
  closeLastInfoWindow();
  for(c in clusterMarkerArrayClean){
    for (m in clusterMarkerArrayClean[c]){
      var marker = clusterMarkerArrayClean[c][m];
      marker.setMap(null);
    }
  }
}
function drawMarkersOnMap(category){
  //
  //  Show markers on certain category
  //
  var selectedBtn = $('a[data-category="'+category+'"]');
  var title = selectedBtn.data("title");
  var titleHtml = $(".overfloat h1");
  titleHtml.html(title);
  TweenMax.killTweensOf(titleHtml);
  TweenMax.to(titleHtml,0,{autoAlpha:1});
  TweenMax.to(titleHtml,3,{delay:5,autoAlpha:0, ease:Linear.easeNone });
  selectedBtn.addClass("selected");
  clearMap();
  var il = clusterMarkerArrayClean[category].length;
  if ( il > 0 ){
    for (i=0;i<il;i++){
      var m = clusterMarkerArrayClean[category][i];
      m.setMap(map);
    }
  }
}
function getMarkerCategories(value){
  var categories = Array();
  for(i in value["category"]){
    var slug = value["category"][i]["slug"];
    categories.push(slug);
  }
  return categories;
};
function addClusteredMarker(catID, value){
  //
  //
  //  Place markers on grid, and group markers that are placed on same grid.
  //
  var lat = value.location.lat;
  var lng = value.location.lng;

  var approxLat = "lat_"+Math.round(lat/densityLat);
  var approxLng = "lng_"+Math.round(lng/densityLng);

  if (!clusterArrayBig[catID]){
    clusterArrayBig[catID] = Array();
  }
  if (!clusterArrayBig[catID][approxLat]){
    clusterArrayBig[catID][approxLat] = Array();
  }
  if (!clusterArrayBig[catID][approxLat][approxLng]){
    clusterArrayBig[catID][approxLat][approxLng] = Array();
  }
  if (!clusterArrayBig[catID][approxLat][approxLng]["markers"]){
    clusterArrayBig[catID][approxLat][approxLng]["location"] = Array();
    clusterArrayBig[catID][approxLat][approxLng]["location"]["lat"] = Math.round(lat/densityLat)*densityLat;
    clusterArrayBig[catID][approxLat][approxLng]["location"]["lng"] = Math.round(lng/densityLng)*densityLng;
    clusterArrayBig[catID][approxLat][approxLng]["markers"] = Array();
    clusterArrayBig[catID][approxLat][approxLng]["is_casestudy"] = value.is_casestudy;
  }
  clusterArrayBig[catID][approxLat][approxLng]["markers"].push(value);
  if (clusterArrayBig[catID][approxLat][approxLng]["is_casestudy"] !== value.is_casestudy){
    clusterArrayBig[catID][approxLat][approxLng]["is_casestudy"] = 999; // clustered marker has mixed values
  }
}
function placeGoogleMaps(value){
  var elevator;

  var topLeft = new google.maps.LatLng(64.21, 1.5);

  var bottomRight = new google.maps.LatLng(12, 134);

  var myOptions = {
      zoom: 3,
      minZoom:2,
      maxZoom:8,
      zoomControl: true,
      center: new google.maps.LatLng(45, 75),
      mapTypeId: 'terrain',
      scrollwheel: false,
      disableDoubleClickZoom: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f7f7f7"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
  };
  map = new google.maps.Map($('#map_canvas')[0], myOptions);
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(topLeft);
  bounds.extend(bottomRight);
  map.fitBounds(bounds);
  clusterArray = Array();
  $.getJSON('/mapmarkers', null, function (data) {
    var markerIndex = 0;
    $.each(data, function(key, value){
      var categories = getMarkerCategories(value);
      categories.push("all");
      value["marker_index"] = markerIndex;
      markerIndex++;
      for(ci in categories){
        var catID = categories[ci];
        addClusteredMarker(catID, value);
        if (!mapMarkersArray[catID]){
          mapMarkersArray[catID] = Array();
        }
      }
    });



    /*

      Place Clustered markers on map

    */
    for(var cat in clusterArrayBig){
      if (!clusterMarkerArrayClean[cat]){
        clusterMarkerArrayClean[cat] = Array();
      }
      for(var lat in clusterArrayBig[cat]){
        for(var lng in clusterArrayBig[cat][lat]){
          var clusterArea = clusterArrayBig[cat][lat][lng];
          if (clusterArea["markers"].length==1){
            var marker = createMapMarker(clusterArea["markers"][0]);
            clusterMarkerArrayClean[cat].push(marker);
          }else{
            var marker = createClusteredMarker(clusterArea["markers"], clusterArea["is_casestudy"]);
            clusterMarkerArrayClean[cat].push(marker);
          }
        }
      }
    }
    drawMarkersOnMap("all");
  });
}
function checkMainMenuAccordion(){
  $(".sidemenu .menu-main-menu-container>ul>li").each(function(index, element){
    if ($(element).hasClass("menu-item-has-children")){
      if ( $(element).hasClass("current_page_parent") || $(element).hasClass("current_page_ancestor") || $(element).hasClass("current-menu-item")){
          $(element).addClass("openAccordion");
      }else{
        $(element).addClass("closedAccordion");
        var obj = $(element).find("ul");
        if (obj.length>0){
          var html = obj.html();
          obj.wrap('<div class="accordion-container opened"></div>');
          obj.addClass("closedAccordion");
        }
      }
    }else{
      $(element).addClass("hasntChildren");
      $(element).append('<div class="placeholder"></div>');
    }
  });
  closeOpenedMenus(0);
  $("body").on("mouseenter","main", function(){
    closeOpenedMenus();
  });
  $(".sidemenu").on("click",".openAccordion", function(){
    //closeOpenedMenus();
  });
  $(".sidemenu").on("click",".hasntChildren", function(){
    //closeOpenedMenus();
  });
  $(".sidemenu").on("click","li.closedAccordion", function(e){ 
    e.preventDefault();
    $(this).on("click", "li", function(e){
      e.stopPropagation();
    })

    var obj = $(this).find("ul");
    var acc = $(this).find(".accordion-container");
    if ( !acc.hasClass("opened") ){
      //closeOpenedMenus();
      acc.addClass("opened");
      var h = obj.innerHeight();
      if (acc.length){
        TweenMax.killTweensOf(acc);
        TweenMax.to(acc,0.75,{height:h,ease:Quad.easeInOut});
      }
    }
    else {
      acc.removeClass("opened");
      if (acc.length){
        TweenMax.killTweensOf(acc);
        TweenMax.to(acc,0.75,{height:0,ease:Quad.easeInOut});
      }
    }
  
  });
}

function closeOpenedMenus(speed){
    if (!speed){
        speed=0.75;
    }
  $(".accordion-container.opened").each( function(index,element){
    var acc = $(element);
    if (acc.length){
      TweenMax.killTweensOf(acc);
      TweenMax.to(acc,speed,{height:0,ease:Quad.easeInOut});
    }
    $(element).removeClass("opened");
  });
}
function resizeMobileMenu(){
    var winHeight = $(window).height();
    var navHeight = $(".mobilemenu .navbar-header");
    var navBarCollapse = $(".mobilemenu .navbar-collapse");

    $(navBarCollapse).css("max-height",(winHeight-(navHeight.height()))+"px");
}
function createButtonHoverEffects(){
    $(".rounded-button").mouseenter(function(e){
        var obj = $(this);
        TweenMax.killTweensOf(obj);
        TweenMax.to(obj,0.2,{scaleX:1.05,scaleY:1.05,ease:Quad.easeOut});
    });

    $(".rounded-button").mouseleave(function(e){
        var obj = $(this);
        TweenMax.killTweensOf(obj);
        TweenMax.to(obj,0.5,{scaleX:1.0,scaleY:1.0,ease:Quad.easeOut});
    });
}
function createModalLinks(){

    if ( $( "a.modalLink" ).length ) {
        $('a.modalLink').magnificPopup({
            type: 'iframe',
            iframe: {
            markup: '<div class="mfp-iframe-scaler">'+
                    '<div class="mfp-close"></div>'+
                    '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                  '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

            patterns: {
                youtube: {
                  index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).

                  id: 'v=', // String that splits URL in a two parts, second part should be %id%
                  // Or null - full URL will be returned
                  // Or a function that should return %id%, for example:
                  // id: function(url) { return 'parsed id'; }

                  src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                },
                vimeo: {
                  index: 'vimeo.com/',
                  id: '/',
                  src: '//player.vimeo.com/video/%id%?autoplay=1'
                },
                gmaps: {
                  index: '//maps.google.',
                  src: '%id%&output=embed'
                }
                },

                srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
            }
        });
    }
}

function trackEventF( eventCategory, eventAction, eventLabel ){
    //console.log("trackEventF: "+eventCategory+", "+eventAction+", "+eventLabel);
    if (typeof(ga) !== 'undefined') {
        ga('send', 'event', {
            eventCategory: eventCategory,
            eventAction: eventAction,
            eventLabel: eventLabel
        });
    }
}
function createRecaptchaEvents(){
  
  $("input").focus(function(){

    $(".subscribe-email-contact .g-recaptcha").show(500);
    $(".subscribe-email-contact .g-recaptcha").addClass("visible");
  });
}

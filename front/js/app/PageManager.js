var PageManager = (function(){
  var instance;
  
  function init() {
    var pages = [];
    var PAGE_VIEW_LEVEL = 1;
    var PANEL_VIEW_LEVEL = 2;
    var loadingGif = "http://cdn2.hubspot.net/hub/290637/file-319004253-gif/spinner.gif";
    var viewLevel = PAGE_VIEW_LEVEL;
    var pageUrl;
    var coordinates = [];
    var frameId = "#frame";
    var panelIndex = 0;
    var pageIndex = 0;
    var pageCenter;
    var $frame = $(frameId);
    var frameCenter;
    var pageWidth;
    var pageHeight;
    var JAW_TOP = ".jaws.top";
    var JAW_BOTTOM = ".jaws.bottom";
    var JAW_RIGHT = ".jaws.right";
    var JAW_LEFT = ".jaws.left";
    
    function resetJaws() {
      if ($frame && $frame.length) {
        $frame.find(JAW_TOP).css("height", "0");
        $frame.find(JAW_BOTTOM).css("height", "0");
        $frame.find(JAW_LEFT).css("width", "0");
        $frame.find(JAW_RIGHT).css("width", "0");
      } else {
        console.warn("Err! No $frame in DOM!?", $frame);
      }
    }
    
    function renderByCoordinates(coordsStr) {
      //cleanup
      resetJaws();
      
      var coordArr = coordsStr.split(",");
      
      if (coordArr.length == 4) {
        var panelX1 = coordArr[0];
        var panelY1 = coordArr[1];
        var panelX2 = coordArr[2];
        var panelY2 = coordArr[3];
        var zoom = 1;
        var jawLength = 0;
        
        var originalPanelWith = panelX2 - panelX1;
        var originalPanelHeight = panelY2 - panelY1;
        var viewerLandscape = $frame.width() > $frame.height();
        var viewerPortrait = !viewerLandscape;
        var panelLandscape = originalPanelWith > originalPanelHeight;
        var panelPortrait = !panelLandscape;

        //if (originalPanelWith >= originalPanelHeight) {
        if (viewerPortrait) {
          zoom = $frame.height() / originalPanelHeight;
        } else {
          zoom = $frame.width() / originalPanelWith;
        }

        var panelWidth = zoom * (panelX2-panelX1);
        var panelHeight = zoom * (panelY2-panelY1);
        
        // TODO refactoring
        if (viewerPortrait && panelWidth > $frame.width()) {
          zoom = $frame.width() / originalPanelWith;
        } else if (viewerLandscape && panelHeight > $frame.height()) {
          zoom = $frame.height() / originalPanelHeight;
        }
        
        panelWidth = zoom * (panelX2-panelX1);
        panelHeight = zoom * (panelY2-panelY1);
        
        // TODO refactor this below, too late, can't think
        if ($frame.width() >= $frame.height()) {
          jawLength = ($frame.height() - panelHeight) / 2;
          if (jawLength > 0) {
            $frame.find(JAW_TOP).css("height", jawLength + "px");
            $frame.find(JAW_BOTTOM).css("height", jawLength + "px");
          } else {
            // if jawLength is `0`, we might have to open the other way
            jawLength = ($frame.width() - panelWidth) / 2;
            $frame.find(JAW_LEFT).css("width", jawLength + "px");
            $frame.find(JAW_RIGHT).css("width", jawLength + "px");            
          }
        } else {
          jawLength = ($frame.width() - panelWidth) / 2;
          if (jawLength > 0) {
            $frame.find(JAW_LEFT).css("width", jawLength + "px");
            $frame.find(JAW_RIGHT).css("width", jawLength + "px");
          } else {
            // if jawLength is `0`, we might have to open it the other way
            jawLength = ($frame.height() - panelHeight) / 2;
            $frame.find(JAW_TOP).css("height", jawLength + "px");
            $frame.find(JAW_BOTTOM).css("height", jawLength + "px");
          }
        }
        
        // moving panel center to page center
        if (viewLevel == PANEL_VIEW_LEVEL) {
          var moveX = frameCenter.x - (panelX1*zoom) - (panelWidth/2);
          var moveY = frameCenter.y - (panelY1*zoom) - (panelHeight/2);
          $frame.css("background-position", moveX + "px " + moveY + "px");
        } else {
          $frame.css("background-position", "center");
        }
        
        $frame.css("background-size", (pageWidth*zoom) + "px", (pageHeight*zoom) + "px");
      } else {
        console.warn("Wrong number of coordinates!", coord);
      }
    }
    
    // renders a panel within the page based on `pageIndex` and `panelIndex`
    function renderPanel() {
      var callback = function() {
        renderByCoordinates(pages[pageIndex].coordinates[panelIndex]);
      }
      
      if (panelIndex >= pages[pageIndex].coordinates.length) {
        if (pages[pageIndex+1]) {
          pageIndex++;
          panelIndex = 0;
          loadPage(pages[pageIndex].url, callback);
        }
      } else if (panelIndex < 0) {
        if (pages[pageIndex-1]) {
          pageIndex--;
          panelIndex = pages[pageIndex].coordinates.length-1;
          loadPage(pages[pageIndex].url, callback);
        }
      } else {
        callback();
      }
    };
    
    // "renders" the WHOLE page based on `pageIndex` and `panelIndex`
    function renderPage() {
      renderByCoordinates("0,0,"+pageWidth+","+pageHeight);
    }
    
    // set the background image aka `page` and triggers a callback when the image has been loaded
    function loadPage(url, callback) {
      $frame.css("background-image", "url(" + loadingGif + ")");
      $frame.css("background-position", "center");
      if (url) {
        var page = new Image();
        page.src = url;
        
        page.onload = function(e) {
          pageWidth = this.width;
          pageHeight = this.height;
          
          pageCenter = {
            x: pageWidth/2,
            y: pageHeight/2
          };
          
          if ($frame) {
            $frame.css("background-image", "url(" + url + ")");
            frameCenter = {
              x: $frame.width()/2,
              y: $frame.height()/2
            };
          } else {
            console.warn("Frame is not present in DOM!", $frame);
          }
          
          if (callback) {
            callback();
          }
        }
      }
    }
    
    function setPage(url, coords) {
      pageUrl = url;
      coordinates = coords;
      loadPage();
    }
    
    return {
      setPage: setPage,
      setPages: function(pagesArr) {
        pages = pagesArr;
      },
      getPageUrl: function() {
        return pageUrl;
      },
      setPageUrl: function(url) {
        pageUrl = url;
      },
      getCoordinates: function() {
        return coordinates;
      },
      setCoordinates: function(newCords) {
        coordinates = newCords;
      },
      getFrameId: function(){
        return frameId;
      },
      setFrameId: function(newFrameId) {
        frameId = newFrameId;
      },
      nextPanel: function() {
        renderPanel(++panelIndex);
      },
      prevPanel: function() {
        renderPanel(--panelIndex);
      },
      setViewLevel: function(level) {
        viewLevel = level;
        if (viewLevel == PANEL_VIEW_LEVEL) {
          panelIndex = 0;
          renderPanel();
        }
        if (viewLevel == PAGE_VIEW_LEVEL) renderPage();
      },
      getViewLevel: function() {
        return viewLevel;
      },
      getPageViewCode: function() {
        return PAGE_VIEW_LEVEL;
      },
      getPanelViewCode: function() {
        return PANEL_VIEW_LEVEL;
      },
      goPrev: function() {
        if (viewLevel == PAGE_VIEW_LEVEL) {
          if (pageIndex > 0) {
            pageIndex--;
            if (pages[pageIndex]) {
              loadPage(pages[pageIndex].url, renderPage);
            }
          }
        } else if (viewLevel == PANEL_VIEW_LEVEL) {
          panelIndex--;
          renderPanel();
        }
      },
      goNext: function() {
        if (viewLevel == PAGE_VIEW_LEVEL) {
          if (pageIndex < pages.length-1) {
            pageIndex++;
            if (pages[pageIndex]) {
              loadPage(pages[pageIndex].url, renderPage);
            }            
          }
        } else if (viewLevel == PANEL_VIEW_LEVEL) {
          panelIndex++;
          renderPanel();
        }
      },
      run: function() {
        if (pages.length > 0) {
          pageIndex = 0;
          panelIndex = 0;          
          
          // based on View Level we set set callback
          loadPage(
            pages[pageIndex].url, 
            (viewLevel == PANEL_VIEW_LEVEL ? renderPanel:renderPage)
          );
        }
      }
    }
  }
  
  return {
    getInstance: function () {
      if ( !instance ) instance = init();
      return instance;
    }
  };
})();
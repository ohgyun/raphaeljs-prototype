(function () {
  
  // Point
  var Point = function (x, y) {
    this.RADIUS = 3;
    this.DIFF_RATIO = 10;
    
    this.x = x;
    this.y = y;
    this.r = this.RADIUS;
  };
  Point.prototype.getUpPoint = function(idx) {
    return this.y - (idx * this.DIFF_RATIO);
  };
  Point.prototype.getDownPoitn = function(idx) {
    return this.y + (idx * this.DIFF_RATIO);
  };

  // Group of point
  var Points = function () {
    this._points = [];
  };
  Points.prototype.add = function(point) {
    this._points.push(point);
  };
  Points.prototype.each = function(callback) {
    var len = this._points.length;
    for (var i = 0; i < len; i++) {
      var p = this._points[i];
      callback.call(p, p, i, i === 0, i === len-1);
    }
  };
  Points.prototype.backEach = function(callback) {
    var len = this._points.length;
    for (var i = len-1; i >= 0; i--) {
      var p = this._points[i];
      callback.call(p, p, i, i === 0, i === len-1);
    } 
  };
  
  
  // Main
  var d = $(document),
    dw = d.width(),
    dh = d.height(),
    paper = Raphael(0, 0, dw, dh),
    CURVE_COUNT = 10;
  
  for (var i = 0; i < CURVE_COUNT; i++) {
    drawRandomCurve();  
  }
  
  function drawRandomCurve() {
    var points = createRandomPoints(),
      color = randomColor();
      
    drawCurve(points, color);
    //drawCircle(points, color);
  }
  
  function createRandomPoints() {
    var POINT_LEN = 5,
      PADDING = 60,
      w = dw - PADDING,
      h = dh - PADDING,
      points = new Points();
      
    for (var i = 0; i <= POINT_LEN; i++) {
      var x = parseInt(w / POINT_LEN) * i + PADDING/2,
        y = random() % h + PADDING/2;

      points.add(new Point(x, y));
    }
    
    return points;
  }  
  
  function random() {
    return parseInt(Math.random() * (1 << 30)); 
  }  
  
  function randomColor() {
    return random().toString(16).replace(/.*(\w{3})/, '#$1');
  } 
    
  function drawCurve(points, color) {
    var pathstr = [];
    
    points.each(function (p, i, isFirst, isLast) {
      if (isFirst) {
        pathstr.push('M', p.x, p.y-(i*10), 'R'); 
      } else {
        pathstr.push(p.x, p.y-(i*10)); 
      }
    });
    
    points.backEach(function (p, i, isFirst, isLast) {
      if (isLast) {
        pathstr.push('L', p.x, p.y+(i*10), 'R'); 
      } else {
        pathstr.push(p.x, p.y+(i*10));
      }
    });
    
    paper.path(pathstr).attr({
      'stroke': 'none',
      'fill': '0-' + color + ':30-#fff',
      'opacity': 0.5
    });
    
  }  
  
  function drawCircle(points, color) {
    points.each(function (point, i) {
      paper.circle(point.x, point.y, point.r).attr({
        'stroke': 'none',
        'stroke-width': 1,
        'fill': color,
        'opacity': 0.5
      });
    });  
  }

}());

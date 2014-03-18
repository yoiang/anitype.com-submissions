/**
 * Register your submission and choose a character
 * For more information check out the documentation
 * http://anitype.com/documentation
 */
Anitype.register('X', {

  // Enter your name
  author: 'Ian G',

  // Enter a personal website, must have http
  website: 'https://github.com/yoiang',

  construct: function(two, points) {
    var anitype = this;

    var tails = [];
    
    for( var vertexIndex = 0; vertexIndex < points.length - 1; vertexIndex ++ )
    {
      var anchor = points[vertexIndex];
      var nextAnchor = points[vertexIndex + 1];
      if (nextAnchor.command === Two.Commands.line)
      {
        var head;
        if (anchor.command === Two.Commands.line)
        {
          head = new Two.Anchor(anchor.destination.x, anchor.destination.y,null,null,null,null, Two.Commands.move);
        } else
        {
          head = anchor;
        }
        var tail = new Two.Anchor(head.x,head.y,null,null,null,null,Two.Commands.line);
        tail.destination = new Two.Vector(nextAnchor.x, nextAnchor.y);
        tails.push(tail);
        if (head != anchor)
        {
          points.splice(vertexIndex + 1, 1, head, tail);
          vertexIndex ++;
        } else
        {
          points.splice(vertexIndex + 1, 1, tail);
        }
      }
    }

    var polygon = anitype.makePolygon(points);
    anitype.addTick( function(percent)
    {
      for (var tailIndex = 0; tailIndex < tails.length; tailIndex ++)
      {
        var tail = tails[tailIndex];
        var lineSub = new Two.Vector(tail.x, tail.y);
        lineSub.lerp(tail.destination, percent);
        tail.x = lineSub.x;
        tail.y = lineSub.y;
      }
    } );

    return two.makeGroup(polygon);
  }

});
var cheerio = require('cheerio')
  , request = require('request')
  , $

exports.index = function(req, res){
  res.render('index');
};

exports.parse = function(req, res) {
  getRosters(req.body, function(err, result) {
    if (err) res.json(400)
    else res.json(200, result)
  })

  function getRosters(input, cb) {
    for (var j=0,leng=input.length;j<leng;j++) {
      if (!/\d+:\d+:\d+/.test(input[j])) {
        return cb(true)
      }
    }
    request('http://ugcleague.com/rosters_tf2h.cfm', function(err, resp, body) {
      var teams = {}

      if (err) {
        console.log(err)
      } else {
        $ = cheerio.load(body)
        getTeam(function(result) {
          cb(null, result)
        })
        
        function getTeam(cb) {
          var done = input.length
            , teamsLength = 0

          for (var i=0; i<done;i++) {
            var id = input[i]
              , len = $('.foottext').length-1
              , foundAll = false

            $('.foottext').each(function(index, el) {
              var sid = $(this).text()
              if (id === sid) {
                var tr = $(this).parent().parent()
                while (tr.attr('bgcolor') !== '000000') {
                  tr = tr.prev()
                }
                teams[id] = tr.find('.link_blue').text()
                teamsLength++
              }
              else if (index === len && !teams[id]) {
                teams[id] = null
                teamsLength++
              }
              if (teamsLength === done) {
                cb(teams)
                foundAll = true
                return false //break out of .each
              }
            }) 
            if (foundAll) { //break out of for loop once finding all teams
              break
            }
          } 
        }
      }
    })
  }
  
}
var submit = document.getElementById('check-btn') 
  , alert = document.getElementById('alert')

alert.classList.add('hidden')
submit.addEventListener('click', function(e) {
  var request = new XMLHttpRequest()
    , sids = document.getElementById('input-area').value
    , matches = sids.match(/\d+:\d+:\d+/g)

  alert.classList.remove('hidden')

  if (!matches) {
    alert.innerHTML = 'No valid STEAMID given'
    submit.disabled = false
    return
  } else {
    alert.innerHTML = 'Working...'
  }

  //disable button to prevent multiple submissions
  submit.disabled = true
  request.onload = function() {
    if (request.status === 200) {
      var data = JSON.parse(request.responseText)
        , keys = Object.keys(data)
        , tbody = document.getElementById('result-tbody')
        , fragment = document.createDocumentFragment()
        , tr
        , td
      
      for (var i=0, len=keys.length;i<len;i++) {
        tr = document.createElement('tr')
        sidtd = document.createElement('td')
        teamtd = document.createElement('td')
        sidtd.appendChild(document.createTextNode(keys[i]))
        if (!data[keys[i]]) {
          teamtd.appendChild(document.createTextNode('None'))
        } else {
          teamtd.appendChild(document.createTextNode(data[keys[i]]))
        }
        tr.appendChild(sidtd)
        tr.appendChild(teamtd)
        fragment.appendChild(tr)
      }
      //show table
      document.getElementById('results').classList.remove('hidden')
      //reenable button
      submit.disabled = false
      //hide alert
      alert.classList.add('hidden')
      tbody.appendChild(fragment)
    } else {
      alert.innerHTML = 'Something bad happened'
      alert.classList.remove('hidden')
      submit.disabled = false
    }
  }
  request.onprogress = function(e) {
    if (e.lengthComputable) {
      console.log('received', e.position, 'of', e.totalSize)
    }
  }
  request.open('post', '/')
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(JSON.stringify(matches))
}, false)
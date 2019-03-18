//looking for a unique day
[
  {
    '$match': {
      'name': {
        '$regex': 'Haunt'
      }
    }
  }, {
    '$group': {
      '_id': {
        'month': {
          '$month': '$lastUpdate'
        }, 
        'day': {
          '$dayOfMonth': '$lastUpdate'
        }, 
        'year': {
          '$year': '$lastUpdate'
        }, 
        'hour': {
          '$hour': '$lastUpdate'
        }, 
        'name': '$name', 
        'parkName': '$parkName'
      }, 
      'average': {
        '$avg': '$waitTime'
      }
    }
  }
]

//scefic day
[
  {
    '$match': {
      'name': {
        '$regex': 'Haunt'
      }, 
      'lastUpdate': {
        '$lte': Date('Mon, 18 Mar 2019 06:00:00 GMT'), 
        '$gte': Date('Sun, 17 Mar 2019 06:00:00 GMT')
      }
    }
  }, {
    '$group': {
      '_id': null, 
      'average': {
        '$avg': '$waitTime'
      }, 
      'max': {
        '$max': '$waitTime'
      }, 
      'min': {
        '$min': '$waitTime'
      }
    }
  }
]


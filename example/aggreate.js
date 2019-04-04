//downtime
[
  {
    '$match': {
      'name': {
        '$regex': 'Splash Moun'
      }, 
      'date': {
        '$lte': Date('Thu, 04 Apr 2019 06:00:00 GMT'), 
        '$gte': Date('Wed, 03 Apr 2019 06:00:00 GMT')
      }
    }
  }, {
    '$unwind': {
      'path': '$rideStatus'
    }
  }, {
    '$group': {
      '_id': {
        'name': '$name', 
        'parkName': '$parkName', 
        'date': '$date'
      }, 
      'DownCount': {
        '$sum': {
          '$cond': [
            {
              '$eq': [
                '$rideStatus.status', 'Down'
              ]
            }, 1, 0
          ]
        }
      }, 
      'OpCount': {
        '$sum': {
          '$cond': [
            {
              '$eq': [
                '$rideStatus.status', 'Operating'
              ]
            }, 1, 0
          ]
        }
      }, 
      'ClosedCount': {
        '$sum': {
          '$cond': [
            {
              '$eq': [
                '$rideStatus.status', 'Closed'
              ]
            }, 1, 0
          ]
        }
      }, 
      'TotCount': {
        '$sum': 1
      }
    }
  }, {
    '$project': {
      'name': 1, 
      'ClosedCount': 1, 
      'DownCount': 1, 
      'OpCount': 1, 
      'TotCount': 1, 
      'downTime': {
        '$divide': [
          '$DownCount', '$TotCount'
        ]
      }
    }
  }, {
    '$sort': {
      'downTime': -1
    }
  }
] 

//
[
  {
    '$match': {
      'name': {
        '$regex': 'Avatar Fl'
      }
    }
  }, {
    '$unwind': {
      'path': '$rideStatus'
    }
  }, {
    '$group': {
      '_id': {
        'hour': {
          '$year': '$date'
        }, 
        'name': '$name', 
        'parkName': '$parkName'
      }, 
      'average': {
        '$avg': '$rideStatus.waitTime'
      }, 
      'max': {
        '$max': '$rideStatus.waitTime'
      }, 
      'min': {
        '$min': '$rideStatus.waitTime'
      }
    }
  }
]

//new one
[
  {
    '$match': {
      'name': {
        '$regex': 'Haunt'
      }, 
      'date': {
        '$lte': Date('Sat, 23 Mar 2019 00:00:00 GMT'), 
        '$gte': Date('Fri, 22 Mar 2019 00:00:00 GMT')
      }, 
      'parkName': {
        '$regex': 'World'
      }
    }
  }, {
    '$unwind': {
      'path': '$rideStatus'
    }
  }, {
    '$group': {
      '_id': {
        'name': '$name', 
        'parkName': '$parkName', 
        'day': '$date'
      }, 
      'average': {
        '$avg': '$rideStatus.waitTime'
      }
    }
  }
]


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


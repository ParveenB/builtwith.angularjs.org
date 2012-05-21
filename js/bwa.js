
function BWAController ($scope, $http, $filter) {
  $scope.sortables = [
    {
      label: 'Name',
      val: 'name'
    },
    {
      label: 'Description',
      val: 'desc'
    },
    {
      label: 'Submitter',
      val: 'submitter'
    }
  ];
  $scope.sortPrep = 'name';

  $http({method: 'GET', url: 'projects.json'}).
    success(function (data, status, headers, config) {

      $scope.projects = data.projects;

      // find the featured project
      for (var i = $scope.projects.length - 1; i >= 0; i--) {
        if (data.projects[i].name === data.featured) {
          $scope.featured = data.projects[i];
          // TODO: remove featured project from search?
          // $scope.projects.slice ...
          break;
        }
      }

      $scope.tags = [];
      $scope.activeTags = [];

      // add tags
      angular.forEach(data.projects, function (project) {
        angular.forEach(project.tags, function (tag) {

          // ensure tags are unique
          if ($scope.tags.indexOf(tag) === -1) {
            $scope.tags.push(tag);
          }
        });
      });

      $scope.tags.sort();
      $scope.search();
    }).
    error(function (data, status, headers, config) {
      // TODO: display a nice error message?
      $scope.error = "Cannot get data from the server";
    });

  var num = 2;
  $scope.filteredProjects = [];
  $scope.groupedProjects = [];

  // search helpers
  var searchMatch = function (haystack, needle) {
    if (!needle) {
      return true;
    }
    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  };

  var hasAllTags = function (haystack, needles) {
    var ret = true;
    angular.forEach(needles, function (needle) {
      if (haystack.indexOf(needle) === -1) {
        ret = false;
      }
    });
    return ret;
  }

  $scope.search = function () {
    $scope.filteredProjects = $filter('orderBy')($filter('filter')($scope.projects, function (project) {
      return (searchMatch(project.desc, $scope.query) || searchMatch(project.name, $scope.query)) &&
        hasAllTags(project.tags, $scope.activeTags);
    }), $scope.sortPrep);
    $scope.group();
  };

  // re-calculate groupedProjects in place 
  $scope.group = function () {

    // TODO: malicious edge cases (?)

    $scope.groupedProjects.length = Math.ceil($scope.filteredProjects.length / num);

    for (var i = 0; i < $scope.filteredProjects.length; i++) {
      if (i % num === 0) {
        $scope.groupedProjects[Math.floor(i / num)] = [ $scope.filteredProjects[i] ];
      } else {
        $scope.groupedProjects[Math.floor(i / num)].push($scope.filteredProjects[i]);
      }
    }

    if ($scope.filteredProjects.length % num !== 0) {
      $scope.groupedProjects[$scope.groupedProjects.length - 1].length = num - ($scope.filteredProjects.length % num);
    }
  };

  $scope.addTag = function () {
    var tagName = this.tag;

    // only allow tags to be added uniquely
    if ($scope.activeTags.indexOf(tagName) !== -1) {
      return;
    }

    angular.forEach($scope.tags, function (tag, i) {
      if (i === 0 && tag === tagName) {
        $scope.activeTags.push($scope.tags.shift());
      } else if (tag === tagName) {
        $scope.tags.splice(i, i);
        $scope.activeTags.push(tag);
      }
    });

    $scope.activeTags.sort();
    $scope.search();
  };

  // TODO: code duplicated here
  $scope.removeTag = function () {
    var tagName = this.tag;
    console.log(tagName);

    angular.forEach($scope.activeTags, function (tag, i) {
      if (i === 0 && tag === tagName) {
        $scope.tags.push($scope.activeTags.shift());
      } else if (tag === tagName) {
        $scope.activeTags.splice(i, i);
        $scope.tags.push(tag);
      }
    });

    $scope.tags.sort();
    $scope.search();
  };
  console.log($scope);
};
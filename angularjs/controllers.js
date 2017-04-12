exports.NavBarController = function($scope, Auth) {
  if(Auth.isLoggedIn()){
    $scope.user = Auth.currentUser();
    setTimeout(function() {
      $scope.$emit('NavBarController');
    }, 0);
  }
};

exports.FooterController = function($scope) {

  setTimeout(function() {
    $scope.$emit('FooterController');
  }, 0);
};

exports.InvoicesGridController = function($scope) {
  $scope.mensaje = "saludos";
};

exports.SetupInvoicesController = function($scope, $http, $location) {
  var days = [];
  for( i = 1 ; i <= 31 ; i++ ){
    days.push(i);
  }
  $scope.days = days;
  $scope.newCategory = {};
  $scope.newReminder = {};
  $scope.categories = {};

  $scope.selectCategory = function(catId){
    $scope.reminders = {};
    $scope.newReminder.categoryId = catId;
    $http.get('/api/reminders/category/' + catId )
    .then(function (response) {
      $scope.reminders = response.data.reminders;
    });
  }

  $http.get('/api/categories')
  .then(function (response) {
    $scope.categories = {};
    $scope.categories.categories = response.data.categories;
  });
  
  //delete category
  $scope.deleteCat = function(catId){
    $http.delete('/api/category/' + catId)
    .then(function (response) {
      $http.get('/api/categories')
      .then(function (response) {
        $scope.categories = {};
        $scope.categories.categories = response.data.categories;
      });
    });
  }

  //save new category
  $scope.saveNewCategory = function(){
    $http.post('/api/category', $scope.newCategory)
    .then(function (response) {
        if(response.data.success) {
          $http.get('/api/categories')
          .then(function (response) {
              $scope.categories.categories = response.data.categories;
          });
        } else {
            $scope.error = response.data.message;
            $scope.dataLoading = false;
        }
    });
    $scope.newCategory = {};
  }

  $scope.cleanNewCategoryForm = function(){
    $scope.newCategory = {};
  }

  //save new reminder
  $scope.saveNewReminder = function(){
    $http.post('/api/reminder', $scope.newReminder)
    .then(function (response) {
        if(response.data.success) {
          //get all data from categories and reminders
          $http.get('/api/categories')
          .then(function (response) {
              $scope.categories.categories = response.data.categories;
          });
        } else {
            $scope.error = response.data.message;
            $scope.dataLoading = false;
        }
    });
    $scope.newReminder = {};
  }

  $scope.removeReminder = function($reminderId){
    $http.delete('/api/reminder/' + $reminderId)
    .then(function (response) {
        if(response.data.success) {
          //get all data from categories and reminders
          $http.get('/api/categories')
          .then(function (response) {
              $scope.categories.categories = response.data.categories;
          });
        } else {
            $scope.error = response.data.message;
            $scope.dataLoading = false;
        }
    });
  }

  $scope.cleanNewReminderForm = function(){
    $scope.newReminder = {};
  }
  
};

exports.LoginController = function($scope, Auth, $location){
  $scope.credentials = {};
  $scope.login = function(){
    Auth.login($scope.credentials, function(data) {
      if(data.success) {
          $location.path('/');
      } else {
          $scope.error = data.message;
          $scope.dataLoading = false;
      }
    });
  }
};

exports.RegisterController = function($scope, $http, $location){
  $scope.user = {};

  $scope.register = function(){
    $http.post('/api/register', $scope.user)
    .then(function (response) {
        if(response.data.success) {
          $location.path('/');
        } else {
            $scope.error = response.data.message;
            $scope.dataLoading = false;
        }
    });
  };
}

exports.LogoutController = function($scope, Auth, $location){
  Auth.logout();
  $location.path('/');
}
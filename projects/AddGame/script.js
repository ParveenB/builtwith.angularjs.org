var addapp=angular.module('addapp',[]);
	addapp.controller('addctrl', ['$scope','$rootScope', function($scope,$rootScope){
         
			$scope.add=[];
                   $scope.count=0;
                   $scope.a=function(num1)
                   {
                   	$scope.number=num1;
                   	$scope.showDetails=true;
                   }
                    			    $scope.getRandomSpan = function(){
                       return Math.floor((Math.random()*6)+1);
                                        } 
					$scope.ans=function(num1,num2)
				{
				$rootScope.check=parseInt(num2)+parseInt(num1);
					  if($rootScope.check==$scope.result)
				     	{   
						$scope.count=$scope.count+1;
						$scope.add.push($scope.result);
            $scope.so=$scope.result;
            $scope.comment=true;
			    		
				    	/*$scope.num2=Math.floor((Math.random()*15)+125);*/
              $scope.num2=(($scope.result*3)-13%3);
	     		    	$scope.f=$scope.count;
                delete $scope.result;
     					}

	                  else
           	           {
           		       $scope.message="SORRY!!! YOU LOSE";
           		       $scope.hideit=true;
           		       $scope.playagain=true;
                 	   delete $scope.result;
                     	}
 			    }


	}]);



addapp.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
});

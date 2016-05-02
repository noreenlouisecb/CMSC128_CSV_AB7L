'use strict';

(function() {
	angular
		.module("app")
		.factory("RandomService", RandomService);

	RandomService.$inject = ["$http", "$q"];

	function RandomService($http, $q) {
		var service = {};
		service.Randomize = Randomize;
		return service;

		function Randomize(randdata) {

			var deferred = $q.defer();

			$http.post("/faculty_user/randomize", randdata)
			.success(function(data) {
				deferred.resolve(data);
			})
			.error(function(data) {
				deferred.reject("Error: Cannot Randomize");
			});

			return deferred.promise;
		}
	}
})();

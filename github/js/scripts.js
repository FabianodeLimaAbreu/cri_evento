/**
*@fileOverview Init's component
* @module Init
*
*/

/**
* Teste Function
* @exports Init
* @constructor
*/
function Init(){
	/**
  	* Start Method
  	* @param {String} txt - value to be alerted
  	* @memberOf Init#
  	* @name start
  	*/
	this.start=function(txt){
		alert(txt);
	};	
}



var init= new Init();
// init.start("Testando");
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
	// Number of subforms of participants
	this.contador=0;
	
	/**
  	* Start Method
  	* @memberOf Init#
  	* @param {String} txt - value to be alerted
  	*/
	this.start=function(txt){
		//var modal = new Modal();
		//modal.open('TITULO!', 'Mensagem.', !0,modal.redirect);

		var self=this;
		console.log(txt);


		cod = "";
		url=window.location.href;
		parametros_url=url.split("?")[1];
		if(parametros_url!=undefined && parametros_url.length>1 && parametros_url[1]!=undefined)
		{
			cod = parametros_url.split(",")[1];	
		} else {
			cod = "";
		}


		$.ajax(
			{
				"url":"http://189.126.197.169/node/servicesctrl_dev/cri_event/find/"+cod,
				"type":"get",
				"dataType":"json",
				"success":function(data){
					console.log(data);
					
					if(data.length>0)
					{
						var modal = new Modal();
						modal.open('Cadastro já efetuado!', 'Verfique o seu email', false,function(){modal.confirmRedirection(cod)});
					}
				}
			}
		);


		$.ajax(
			{
				"url":"/evento-criciuma-2017/ajax/list.js",
				"type":"get",
				"dataType":"json",
				"success":function(data){
					console.log(data);
					encontrado = false;
					for(var i in data)
					{

						//console.log(data[i]["cod"]);
						//console.log(cod);
						if(data[i]["cod"]==cod)
						{
							encontrado = true;
							$("#razaosocial").html(data[i]["RAZAO"]);

							$("#codigo").html(data[i]["CODIGO"]);
							$(".form1").find("[name='nome_participante']").val(data[i]["REPRESENTANTE"]);
							$(".form1").find("[name='cargo']").val("Representante");
							$(".form1").find("[name='email']").val(data[i]["EMAIL"]);
						}
					}
					if(encontrado == false) {
						var modal = new Modal();
						modal.open('Código não encontrado', 'Contate seu representante', true,modal.redirect);
					}
				}
			}
		);

		$(".add-btn").on("click",function(e){
			self.addclick(e);
		});

		$(".confirm-btn").on("click",function(e){
			if(self.validate(e)) {
				self.confirm(e);
			} else {
				var modal = new Modal();
				modal.open('Preenchimento incorreto', 'Verifique os campos.', true);
			}
		});

		$("body").on("click",".remove-btn",function(e){
			$(this).closest("form").remove();
			self.contador-=1;
		});

	};

	/**
  	* AddClick Method
  	* Action performed when the user clicks the add button
  	* @memberOf Init#
  	* @param {Object} e - Reference the event
  	*/
	this.addclick=function(e) {
		e.preventDefault();
		//console.log(this.contador);
		if(this.contador<3)
			{
				form_html = "<form class='adictional adicform'>";
				form_html += $("#form-structure").html();
				form_html+="</form>";
				$("#form-structure").before(form_html);
				this.contador+=1;
			}
			else
			{
				console.log("Máximo atingido");
			}
	}
	/**
  	* Confirm Method
  	* Action performed when user clicks confirm button
  	* @memberOf Init#
  	* @param {Object} e - Reference the event
  	*/
	this.confirm=function(e) {
		url=window.location.href;
		parametros_url=url.split("?")[1];

		cod = "";

		if(parametros_url!=undefined && parametros_url.length>1 && parametros_url[1]!=undefined)
		{
			cod = parametros_url.split(",")[1];	
		}

		//id = "";
		name = $(".form1").find("[name='nome_participante']").val();
		cargo = $(".form1").find("[name='cargo']").val();
		email = $(".form1").find("[name='email']").val();
		codigo = $("#codigo").html();
		razaosocial = $("#razaosocial").html();

		var segments = [];
		$(".form1").find("input[name='segmento[]']:checked").each(function ()
		{
			if($(this).val()=="other")
			{
				segments.push({"segtype":"other","segval":$(this).parent().find(".other").val()});
				//console.log("other");
				//console.log($(this).parent().find(".other").val());
			}
			else
			{
				segments.push({"segtype":"select","segval":$(this).val()});
				//console.log("select");
				//console.log($(this).val());
			}
		    
		});



		// Trata os convidados
		var participants=[];
		$(".adicform").each(function(){
			pname = $(this).find("[name='nome_participante']").val();
			pcargo = $(this).find("[name='cargo']").val();
			pemail = $(this).find("[name='email']").val();


			var psegments = [];
			$(this).find("input[name='segmento[]']:checked").each(function ()
			{
				if($(this).val()=="other")
				{
					psegments.push({"segtype":"other","segval":$(this).parent().find(".other").val()});
				}
				else
				{
					psegments.push({"segtype":"select","segval":$(this).val()});
				}
			    
			});
			participant = {
				"pname": pname,
				"pcargo": pcargo,
				"pemail": pemail,
				"psegments": psegments,
				"pcodigo": codigo,
				"prazao": razaosocial
			}
			participants.push(participant);
		});



		post_data = {
				"cod": cod,
				"codigo" : codigo,
				"razao": razaosocial,
				"name" : name,
				"cargo": cargo,
				"email": email,
				"segments": segments,
				"participants": participants
		};
		//console.log(post_data);
		//console.log(JSON.stringify(post_data));


		 $.ajax({
            url: 'http://189.126.197.169/node/servicesctrl_dev/cri_event/insert',
            data: JSON.stringify(post_data),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function(data) {
              console.dir(data);
              if(data.errors==undefined)
              {
              	window.location.href="confirmation.html?368,"+cod;
              }
              else
              {
              	console.log("Verifique os campos obrigatórios");
              }
            },
        });
	}
	/**
  	* Validate Method
  	* Validate form fields
  	* Checks the required fields, returns true did not encounter any problems, otherwise highlights the fields with problem and returns false.
  	* @memberOf Init#
  	*/
	this.validate=function(){

		result = true;

		
		if($(".form1").find("input[name='segmento[]']:checked").length>0){
			if($(".form1").find("input[name='segmento[]'][value='other']:checked").length>0 && $(".form1").find(".other").val()==""){
				result = false;
				$(".form1").find(".other").addClass("error");
			} else {
				$(".form1").find(".other").removeClass("error");
			}
			$(".form1").find(".ulsegmentos").removeClass("error");
		} else {
			result = false;
			$(".form1").find(".other").removeClass("error");
			$(".form1").find(".ulsegmentos").addClass("error");
			//console.log("Selecione pelo menos um segmento");
			
		}

		$(".adicform").each(function(key,value){
			if($(this).find("[name='nome_participante']").val()==""){
				result = false;
				$(this).find("[name='nome_participante']").addClass("error");
				//console.log("Informe o nome do participante");
			} else {
				$(this).find("[name='nome_participante']").removeClass("error");
			}
			if($(this).find("[name='cargo']").val()==""){
				result = false;
				$(this).find("[name='cargo']").addClass("error");
			} else {
				$(this).find("[name='cargo']").removeClass("error");
			}
			if($(this).find("[name='email']").val()==""){
				result = false;
				$(this).find("[name='email']").addClass("error");
			} else {
				$(this).find("[name='email']").removeClass("error");
			}



			if($(this).find("input[name='segmento[]']:checked").length>0) {
				if($(this).find("input[name='segmento[]'][value='other']:checked").length>0 && $(this).find(".other").val()==""){
					result = false;
					$(this).find(".other").addClass("error");
				} else {
					$(this).find(".other").removeClass("error");
				}
				$(this).find(".ulsegmentos").removeClass("error");
			} else {
				result = false;
				$(this).find(".other").removeClass("error");
				$(this).find(".ulsegmentos").addClass("error");
			}
		});
		
		return result;
	}

	
}

/**
* rovides the base of modal used in application
* @exports Modal
* @constructor
*/

function Modal(el,buttons,btnclose) {
	var self = this;
	this.el = $("#modal");
	this.buttons = $(".modal-buttons");
	this.btnclose = $(".bclose");
	this.callback = null;

	this.btnclose.bind("click",function(a) {
		self.close(a);
	});
	
	/**
	    * Open a new Modal 
	    * @param {String} title - Title that will be showed in modal
	    * @param {String} msg - Message that will be showed in modal
	    * @param {Boolean} buttons - If true, the message will be in red (alert). If false, it will be blue (warning). 
	    * @param {Boolean} btnclose - Page that will be redirect
	    * @memberOf Modal#
	*/
	this.open = function(title,msg,isbad,callback) {
		this.el.find("h2").text(title);
		this.el.find("p").text(msg);
		if (callback && "function" === typeof callback)
				this.callback = callback;
		
		if (isbad) {
			this.el.addClass('bad');
		} else {
			this.el.removeClass("bad");
		}
		
		this.el.fadeIn();
	};

	/**
	    * Provides the base of modal used in application
	    * @param {String} title - Title that will be showed in modal
	    * @param {String} msg - Message that will be showed in modal
	    * @param {Boolean} buttons - If true, the message will be in red (alert). If false, it will be blue (warning). 
	    * @param {Boolean} btnclose - Page that will be redirect
	    * @memberOf Modal#
	*/
	this.close=function(a) {
		if ("object" === typeof a) {
	        a.preventDefault(), $(a.target);
	    }
	    
	    this.el.fadeOut();
	    this.callback && this.callback();
	};

	this.redirect=function(txt){
		window.location.href="http://www.focustextil.com.br";
	}

	this.confirmRedirection=function(txt){
		window.location.href="http://www.focustextil.com.br/evento-criciuma-2017/confirmation.html?368,"+txt;
	}
}

var init= new Init();
 init.start("");
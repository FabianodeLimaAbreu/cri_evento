if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(search, replace) {
        'use strict';
        if (replace === undefined) {
            return this.toString();
        }
        return this.split(search).join(replace);
    }
}

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
	var content=new Content();
	this.contador=0;
	
	/**
  	* Start Method
  	* @memberOf Init#
  	* @param {String} txt - value to be alerted
  	*/
	this.start=function(txt){
		var self=this;

		var userId = location.href.split(',')[1];

		$.ajax(
			{
				"url":"http://189.126.197.169/node/servicesctrl_dev/cri_event/find/"+userId,
				"type":"get",
				"dataType":"json",
				"success":function(data){					
					if(data.length)
					{
						self.sendEmail(data[0]);
					}
					else{
						var modal = new Modal();
						modal.open('Feche esta janela!', 'Nenhuma inscrição encontrada para este participante.', !0,modal.redirect);
					}
				}
			}
		);
	};

	this.sendEmail=function(data){
		content.lines="";
		content.renderContent(content.temps["confirmation"],data);
		content.container.append(content.lines);
		var segments=data.segments.map(function(a) {return a.segval;});
		var CLIENT = {
            Codigo: data.codigo,
            Cargo: data.cargo,
            Email: data.email,
            Nome: data.name,
            Razao: data.razao,
            Segmentos: segments.join(" , ")
        };
        $.ajax({
            url: 'http://ii3/services/Services/EV.svc/SendEmail/0',
            data: JSON.stringify(CLIENT),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            traditional: true,
            success: function(a) {
              if(data.participants){
              	var i=0;
              	while(i < data.participants.length){
              		content.lines="";
					content.renderContent(content.temps["confirmation_participant"],data.participants[i]);
					content.container.append(content.lines);
              		var seg=data.participants[i].psegments.map(function(a) {return a.segval;});
              		var CLIENT = {
			            Codigo: data.participants[i].pcodigo,
			            Cargo: data.participants[i].pcargo,
			            Email: data.participants[i].pemail, //data.participants[i].pemail
			            Nome: data.participants[i].pname,
			            Razao: data.participants[i].prazao,
			            Segmentos: seg.join(" , ")
			        };
			        $.ajax({
			            url: 'http://ii3/services/Services/EV.svc/SendEmail/0',
			            data: JSON.stringify(CLIENT),
			            type: 'POST',
			            contentType: "application/json; charset=utf-8",
			            traditional: true,
			            success: function(a) {
			            	console.log("sucesso");
			            }
			        });
			        i++;
              	}
              }
            },
        });
	};
	
}


function Content(){
	/**
	* Replace all attributes of the html with the values of json
	* @param {String} tpl - template to create itens
	* @param {Array} data - list of object to replate template
	* @return {String} tpl - return a String to be append to container after
	* @memberOf Content#
	* @name mergeData
	*/
	this.mergeData=function(tpl, data) {
	    var val, i,atts;
	    atts = Object.keys(data);
	    for (i = atts.length - 1; i >= 0; i--) {
	        val = this.contentType(atts[i], data);
	        tpl = tpl.replaceAll("{{" + atts[i] + "}}", val);
	    }
	    return tpl;
	};
	/**
	* Fill a table or list with data
	* @param {string} tpl - string HTML Template
	* @param {Function} callback - function to be executed after renderContent
	* @memberOf Content#
	* @name renderContent
	*/
	this.renderContent= function(tpl, data, callback) {
	    var i;

	    /*for (i = 0; i < data.length; i++) {
	        lines += this.mergeData(tpl, data[i]);
	    }*/
	    this.lines += this.mergeData(tpl, data);

	    //'<li class="col col-sm-1 col-sm-2 col-md-1 col-md-2 col-md-3 col-med-4 col-lg-1 col-lg-2 col-lg-3 col-lg-4 ng-scope"><div class="thumbnail"><a href="#detail/{{MATNR}}"><img src="http://189.126.197.169/img/small/small_{{IMG_MATNR}}.jpg"></a><div class="caption"><div class="caption-top"><a href="#detail/{{MATNR}}" class="link">{{MATNR}}</a><h4>{{MAKTX}}</h4><p class="pantone">Pantone: {{CODIGO_PANTONE}}</p></div><ul class="estoque"><li class="storage line">PE: {{PE}}</li><li class="storage">ATC: {{ATC}}</li></ul><ul ng-show="true" class="view_24"><li><a href="/focus24h/#detail/{{MATNR}}" name="{{MATNR}}" target="_blank"><p>Reserve este artigo</p></a></li></ul></div></div></li></ul>'
	    if (callback && typeof(callback) === "function") {
	        callback();
	    }else{
	        return !1;
	    }
	};

	/**
	* Adjustments in the content when some attributes need a special treatment
	* @param {String} att - Attribute to be find and treat
	* @param {Array} data - Object to has it's attr treated
	* @return {Object} data[att] - Value returned from a treat
	* @memberOf Content#
	* @name contentType
	*/
	this.contentType= function(att, data) {
	    switch (att) {
	        case "codigo":
	          return data[att];
	          break;
	        case "name":
	          return data[att];
	          break;
	        case "pname":
	          return data[att];
	          break;
	        case "razao":
	          return data[att];
	          break;
	        case "prazao":
	          return data[att];
	          break;
	        case "cargo":
	          return data[att];
	          break;
	        case "pcargo":
	          return data[att];
	          break;
	        case "email":
	          return data[att];
	          break;
	        case "pemail":
	          return data[att];
	          break;
	        case "segments":
	          var seg=data[att].map(function(a) {return a.segval;});
	          return seg.join(" , ");
	          break;
	        case "psegments":
	          var seg=data[att].map(function(a) {return a.segval;});
	          return seg.join(" , ");
	          break;
	        default:
	            return data[att];
	    }
	};
	this.init = function(){
	    this.lines = "";
	    // Samples of templates
	    // {{XX}} - XX sendo o nome do atributo no objeto.
	    this.temps={
	      'confirmation':'<br/><dl class="confirm-list"><dt><span>Razão Social:</span><p class="razao">{{razao}}</p></dt><dt><span>Código:</span><p>{{codigo}}</p></dt><dt><span>Nome do Participante:</span><p>{{name}}</p></dt><dt><span>Cargo:</span><p>{{cargo}}</p></dt><dt class="biggest"><span>E-Mail:</span><p>{{email}}</p></dt><dt class="biggest"><span>Segmentos:</span><p>{{segments}}</p></dt><dt class="biggest"><p class="adress"> <b>Local:</b> Hotel OMA ZITA <br><b>Endereço:</b> R. Cinquentenário Leonardo Steiner, 511 - Centro,  Forquilhinha - SC, CEP 88850-000 <br><b>Data:</b> 04/05/17 – Quinta-feira | <b>Horário:</b> à partir das 08h00</p><br><p class="adress">-Uma cópia da confirmação foi enviada para seu e-Mail. <br>-Apresente uma cópia desta confirmação na entrada do evento</p></dt></dl>',
	      'confirmation_participant':'<br/><dl class="confirm-list"><dt><span>Razão Social:</span><p class="razao"> {{prazao}} </p></dt><dt><span>Codigo:</span><p> {{pcodigo}} </p></dt><dt><span>Nome do Participante:</span><p>{{pname}}</p></dt><dt><span>Cargo:</span><p>{{pcargo}}</p></dt><dt class="biggest"><span>E-Mail:</span><p>{{pemail}}</p></dt><dt class="biggest"><span>Segmentos:</span><p>{{psegments}}</p></dt><dt class="biggest"><p class="adress"> <b>Local:</b> Hotel OMA ZITA <br><b>Endereço:</b> R. Cinquentenário Leonardo Steiner, 511 - Centro,  Forquilhinha - SC, CEP 88850-000 <br><b>Data:</b> 04/05/17 – Quinta-feira | <b>Horário:</b> à partir das 08h00</p><br><p class="adress">-Uma cópia da confirmação foi enviada para seu e-Mail. <br>-Apresente uma cópia desta confirmação na entrada do evento</p></dt></dl>'
	    
	    }
	    this.page = 0;
	    this.container=$(".content");
	};
	this.init();
};
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
}

var init= new Init();
 init.start("Testando");
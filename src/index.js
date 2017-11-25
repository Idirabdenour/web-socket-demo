import './index.css';
import nameGenerator from './name-generator';
import isDef from './is-def';
  
/************Stockez / récupérez le nom dans / depuis un cookie.****************/

const cookies = document.cookie.split(';');
let wsname = cookies.find(function(c) {
  if (c.match(/wsname/) !== null) return true;
  return false;
});
if (isDef(wsname)) {
  wsname = wsname.split('=')[1];
} else {
  wsname = nameGenerator();
  document.cookie = "wsname=" + encodeURIComponent(wsname);
}
// Set the name in the header
document.querySelector('header>p').textContent = decodeURIComponent(wsname);

/*********************Instance avec le model objet***********************/

class Sensor {
  constructor(name, value, type){
    this._name = name;
    this._value = value;
    this._type = type;
    this._moy = value;
    this._incr = 1;
  }
   get name(){
    return this._name;
   }
   get value(){
    return this._value;
   }
   set value(value){
     this._value= value;
     if(!isNaN(Number(this._value))){
       this._moy = this._moy + Number(value);
       this._incr++;
     }
   }
  //Affichage
   Affich(){    
         var conc = '<B>Nom :</B>'+this._name + ' | <B>valeur :</B>' + this._value +' | <B>Moyenne :</B> '+ this._moy / this._incr + ' | <B>type :</B>'+this._type;
      return conc
    }
}

/*********************************MQTT*******************************/
//Le server utilise le port 1234
var port = '1234';
// se connecter au server mqtt
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://127.0.0.1:'+port);
  client.subscribe('#');
  
/******************************Affichage********************************/  
  //Tab est une liste qui utilise les données récupérées dans mqtt 
  var Tab=[];
  
  client.on('message', function(topic,message){
   var name = topic.substring(topic);
   var json = JSON.parse(message);
  
   //Initialisé les élément du tableau par nom
   var position = 0;
   for(var i = 0; i < Tab.length; i++){
     if(Tab[i].name === name){
       position = i;
     }
    }
     
     var sensor = new Sensor(name, Number(json.value),json.type);
     Tab.push(sensor);

     var Affich = document.getElementById('messages');
     
     //Associer les lignes aux noms
     var ligne = document.createElement('tr');
     ligne.id = name;
     Affich.appendChild(ligne);
     
     //Créé un saut de ligne
     var es = document.createElement('br');
     Affich.appendChild(es);
     
     // Mettre à jour la valeur du capteur
		 Tab[position].value = json.value;
     
     //Mettre  à jour de la page
   	 document.getElementById(name).innerHTML = Tab[position].Affich();	
	
 });
 




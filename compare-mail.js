require('dotenv').config()
var request = require('request');

const readline = require('readline');
const log = console.log;
const report = { 'error' : '\x1b[37m > \x1b[31m[Error] \x1b[0m',
				 'info' : '\x1b[37m > \x1b[34m[Info] \x1b[0m',
				 'warning' : '\x1b[37m > \x1b[33m[Warning] \x1b[0m',
				 'success' : '\x1b[37m > \x1b[32m[Success] \x1b[0m',
				 'failed' : '\x1b[37m > \x1b[31m [Failed] \x1b[0m',
				 'general' :  '\x1b[37m > \x1b[0m'};

const notification = { 'error' : '\x1b[31m Error \x1b[0m',
					 'info' : '\x1b[34m Info \x1b[0m',
					 'warning' : '\x1b[33m Warning \x1b[0m',
					 'success' : '\x1b[32m Success \x1b[0m',
					 'failed' : '\x1b[31m Failed \x1b[0m'};

var idlecmd = '('+ process.env.CHIMP_API_USER +')\x1b[37m > \x1b[0m';
var lists = { id : '', name : ''};

var option = {
	url : process.env.CHIMP_API_URL,
	headers : {'Authorization' : 'Basic ' + new Buffer(+ process.env.CHIMP_API_USER + ':' + process.env.CHIMP_API_KEY).toString('base64') }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perintah(){
	rl.question(idlecmd, (hasil)=>{
		hasils = hasil.split(" ");
		if(hasils.length==1){
			switch(hasil.toString()){
				case "lists":
					request(option, function(error, response, body){
						var hasil = JSON.parse(body);
						if(hasil.total_items>0){
							log(report.general + hasil.total_items + ' Lists Available');
						}
						hasil.lists.forEach(function(list){
							log(report.general + list.id + " " + list.name);
						});
						perintah();	
					});
					break;
				case "list":
					if(lists.id ==""){
						log(report.warning + " You didn't set to any available Lists, set it first with 'list set id'");
					}else{
						log(report.info + " You are connected to list " + process.env.LISTS.name + " with ID " + process.env.LISTS.id );
					}
					break;
				case "stats":
					if(lists.id!=''){
						request(option, function(error, response, body){
							var result = JSON.parse(body);
							log(result.stats);
							perintah();
						});
					}else{
						log(report.warning + " You didn't set to any available Lists, set it first with 'list set id'");
					}
					break;
				case "exit":
					log(report.general + "Thanks for using this :D");
					rl.close();
					break;
				default:
					log(report.error + "Command Not found, try help");
					perintah();
					break;
			}				
		}else if(hasils.length==3){
			if(hasils[0].toString()=="list"){
				if(hasils[1].toString()=="set"){
					lists.id = hasils[2];
					option.url = process.env.CHIMP_API_URL + lists.id;
					request(option, function(error, response, body){
						var result = JSON.parse(body);
						log(report.success + "Connected to list f4db1367e8");
						idlecmd = '('+ process.env.CHIMP_API_USER +')\x1b[33m['+ lists.id +']\x1b[37m > \x1b[0m';
						perintah();
					});
				}else{
					log(report.error + "Command Not found, try help");
					perintah();
				}
			}else{
				log(report.error + "Command Not found, try help");
				perintah();
			}
		}else{
			log(report.error + "Command Not found, try help");
			perintah();
		}
	});
}

function main(){
	var connection = false;
	var config = false;

	process.stdout.write(report.general + 'Check Connection to Mailchimp');
	request("https://status.mailchimp.com/", function(error, response, body){
		if(response.statusCode==200){
			process.stdout.write(notification.success + '\n');
			log(report.success + "Success Connected to Mailchimp");
			connection=true;
		}

		process.stdout.write(report.general + 'Check Configuration');

		if(connection){
			request(option, function(error, response, body){
				if(response.statusCode==200){
					process.stdout.write(notification.success + '\n');
					log(report.success + "Success Authenticated to Mailchimp");
					log(report.general + "Enjoy!");
					perintah();
				}
			});
		}else{
			log('\n' + report.error + "Please Check again your connection");
		}
	});
	
}

main()
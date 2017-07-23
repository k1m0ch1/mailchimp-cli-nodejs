require('dotenv').config()
var request = require('request');
var fs = require('fs');
var config = require('E:\\Document\\Crowde\\listemail.json');
var crypto = require('crypto');
var sleep = require('system-sleep');

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
var url = process.env.CHIMP_API_URL;

var option = {
	url : url,
	headers : {'Authorization' : 'Basic ' + new Buffer(+ process.env.CHIMP_API_USER + ':' + process.env.CHIMP_API_KEY).toString('base64') }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function comparing(){
	config.RECORDS.forEach(function(list){
		sleep(300);
		var md5 = list.email!=null?crypto.createHash('md5').update(list.email).digest("hex"):"";
		log(report.info + "Check email " + list.email);
		option.url = process.env.CHIMP_API_URL + "f4db1367e8/members/" + md5 ;
		request(option, function(error, response, body){
				if(response.statusCode!=200){
					//var hasil = JSON.parse(body);
					//log(report.info + "email " + list.email + " " + hasil.status + " as " + hasil.email_address);
					log(report.warning + "email " + list.email + " Tidak Terdaftar");
					var daftar = {
									email_address: list.email, 
									status : "subscribed", 
									merge_field : {
										MMERGE3 : list.name,
										MMERGE4 : list.birthdate,
										MMERGE5 : list.phone,
										MMERGE6 : list.address
									}
					};
					daftar = JSON.stringify(daftar);
					request.post({url: process.env.CHIMP_API_URL + "f4db1367e8/members/", 
								  headers : {'Authorization' : 'Basic ' + new Buffer(+ process.env.CHIMP_API_USER + ':' + process.env.CHIMP_API_KEY).toString('base64') },
								  form : daftar
								}, function(e,r,b){
									if(r.statusCode==200){
										log(report.success, list.email + " Sukses didaftarkan");
									}else{
										var hasil = JSON.parse(b);
										log(report.failed, list.email + " " + hasil.detail);
									}
								});
				}else if(response.statusCode==200){
					log(report.info + "Email" + list.email + " Terdaftar");
				}
		});
	});
}

function perintah(){
	rl.question(idlecmd, (hasil)=>{
		if(hasil.toString()=="compare"){
			setTimeout(comparing, 500);
		}
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
						perintah();
					}else{
						log(report.info + " You are connected to list " + lists.name + " with ID " + lists.id );
						perintah();
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
				case "members":
					if(lists.id!=''){
						log(url.split("/")[6]);
						url = url.split("/")[6]!="members"?url + "/members":url;
						option.url = url;
						request(option, function(error, response, body){
							var result = JSON.parse(body);
							log(result.members);
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
				case "back":
					log(report.info + "Back to root state");
					idlecmd = '('+ process.env.CHIMP_API_USER +')\x1b[37m > \x1b[0m';
					lists = { id : '', name : ''};
					url = process.env.CHIMP_API_URL;
					option.url = url;
					perintah()
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
					url = url + lists.id;
					option.url = url;
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
			}else if(hasils[0].toString()=="member"){
				url = url.split("?")[0]!="offset"&&url.split("/")[6]!="members"?url + "/members?offset=" + hasils[1] + "&count=" + hasils[2]:url;
				option.url = url;
				request(option, function(error, response, body){
						var result = JSON.parse(body);
						log(result);
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
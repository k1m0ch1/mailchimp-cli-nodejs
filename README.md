# Simple Mailchimp nodejs cli

Need to run by creating config file `.env` with format :


```file
CHIMP_API_URL= <URL API>
CHIMP_API_USER= <USER MAILCHIMP>
CHIMP_API_KEY= <API KEY MAICHIMP>
```



`npm install` first and then run it with `node run.js`



## Available command 

### Root position

After running the command `node run.js` and successfully connection and authenticate with mailchimp app will give the state to input the command, heres a list of available command from this position :

#### lists

Listing all available lists on the mailchimp, with format of ID and Name of the Lists, just type `lists` and enter.

#### list set <id>

To explore the content of the lists, need to set the ID of lists first, with command `list set <id>` will return a new state as an ID lists 

#### exit

State when you don't know what to do after starting the program (only foolish doing this), state when you in concious mind and trying to terminate the program while in state of an idle, state when you spill your coffee over your suit and blamming the coffee maker and sell it to , state when you realize you are typing `exiy`, state when you laying on the gorund while crying and rolling realize your deadline is 6 hour left, state when you are realize you are an ex-IT employee in some worst company, state when you open many of this program on many console on many host and many server and forget to terminate it, state when you complete reading this for nothing.



but anyway you can try `Ctrl` + `C` if you want to terminate the process immediatly.

### List Position

#### stats

Infromation statistic about current list

#### back

Back to the root position

#### compare <full path file location>

comparing list of member mailchimp with list of file json recommended json format object is `email`, `name`, `birthdate`, `phone`, `address` like example :

command : `compare E:\\to\\file\\name.json` or `compare /home/k1m0ch1/filename.json`

with content of file :

```json
{
"RECORDS":[
{
"name":"Sheila Hana Ajijah",
"email":"sheilaahana@gmail.com",
"address":"Kota Cimahi",
"birthdate":"1997\/7\/11",
"phone":"082240667056"
},
{
"name":"Sheila Hana Ajijah",
"email":"debritzhana@gmail.com",
"address":"Kota Cimahi",
"birthdate":"1997\/7\/11",
"phone":"082240667056"
},
{
"name":"Galih Pratama",
"email":"hanamura.iost@gmail.com",
"address":"Jl. Nusa Sari Utara 1 No. 19 Perumahan Taman Citeureup",
"birthdate":"1994\/12\/14",
"phone":"085710104467"
}
]
}
```

#### compare-add <full path file location>

comparing list of member mailchimp with list of file json, if the email on json are not registered on lists, add a new email and subscribed, recommended json format object Parent `RECORDS` with filed `email`, `name`, `birthdate`, `phone`, `address` ( following like compare command )and the new member will be added with merge field 
```json
merge_field : {
	MMERGE3 : list.name,
	MMERGE4 : list.birthdate,
	MMERGE5 : list.phone,
	MMERGE6 : list.address
}
```
## Bug

- When using compare command after success the layout of output text will over by a newline
- some command doesn't have a handler when on list position



## To do

- complete list api
- handler command
- add image for this project
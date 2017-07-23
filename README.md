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

#### lists

List available list

#### list set <id>

Set current list to <id> list

#### exit

Terminate program

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


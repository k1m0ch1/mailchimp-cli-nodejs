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


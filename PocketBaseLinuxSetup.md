# PocketBase Linux Setup

## Back to Main Document
https://github.com/MrRedBeard/PocketBase-Implementation/blob/main/README.md

## Commands
- Serve `./pocketbase serve`
- Help `./pocketbase --help` or `./pocketbase [command] --help`

## Ports (Local)
- Static Content: http://localhost:8090/ - if pb_public directory exists, serves the static content from it (html, css, images, etc.)
- Admin dashboard UI: http://localhost:8090/_/
- REST API: http://localhost:8090/api/

## Files
- pb_data PocketBase will automically create a new directory pb_data alongside the executable to store your application data and settings.  
On linux these files will be owned by the user that runs PocketBase the first time.

## Test Account
email  
password12  

## Copy PocketBase Files
- Get executable from https://github.com/pocketbase/pocketbase  

sudo adduser pocketbase  
	password  
sudo usermod -G www-data pocketbase  
sudo usermod -G www-data [yourusername]  
sudo mkdir /var/pocketbase  
sudo chmod -R 775 /var/pocketbase  
sudo chown -R pocketbase:www-data /var/pocketbase  
sudo chown -R [yourusername]:www-data /var/pocketbase  
to /var/pocketbase/pocketbase  
sudo chmod 0774 /var/pocketbase/pocketbase  

## Setup Linux Environment
sudo apt-get update  
sudo apt-get upgrade  
sudo apt install ufw  
sudo ufw allow http  
sudo ufw allow https  
sudo ufw allow ssh  
sudo ufw allow ftp  
sudo ufw disable  
sudo apt install vsftpd  
sudo systemctl start vsftpd  
sudo systemctl enable vsftpd  
sudo apt install vim-tiny  
sudo adduser [yourusername] sudo  
sudo vi /etc/sudoers  
	Add  
	[yourusername] ALL=(ALL)  ALL  
sudo apt install nginx  

## Configure PocketBase
On first run you will be prompted for an email address and password so this must be done before first run  
Because we are running as a service we need to execute it as the service  
su -l pocketbase  
/var/pocketbase/pocketbase serve  

email  
password12  

## Nginx as proxy for PocketBase
cd /etc/nginx/sites-available  
sudo vi /etc/nginx/sites-available/reverse-proxy.conf  

```
server {
    listen 9080;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://localhost:8090;
    }
}
```

Activate the directives by linking to /sites-enabled/ using the following command  
sudo ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf  
sudo nginx -t  
sudo systemctl reload nginx  
sudo systemctl restart nginx  
systemctl status nginx.service  

sudo ufw allow 9080  
sudo ufw enable  

## Service
Let pocketbase user run the service  
sudo vi /lib/systemd/system/pocketbase.service  
```
[Unit]
Description = pocketbase

[Service]
Type           = simple
User           = pocketbase
Group          = www-data
LimitNOFILE    = 4096
Restart        = always
RestartSec     = 5s
StandardOutput = append:/var/pocketbase/logs/stdOutErrors.log
StandardError  = append:/var/pocketbase/logs/stdErrors.log
ExecStart      = /var/pocketbase/pocketbase serve

[Install]
WantedBy = multi-user.target
```

sudo systemctl enable pocketbase.service  
sudo systemctl daemon-reload 
sudo systemctl start pocketbase   
sudo systemctl status pocketbase  
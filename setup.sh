#!/bin/bash
sudo brew update || apt-get update
sudo  brew install postgresql postgresql-contrib || apt-get -y install postgresql postgresql-contrib
sudo -u postgres psql postgres < dump.sql
sudo brew -y install nodejs npm || apt -y install nodejs npm
npm install
npm start
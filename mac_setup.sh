#!/bin/bash
brew install postgresql
pg_ctl -D /usr/local/var/postgres start && brew services start postgresql
psql postgres < dump.sql
brew install node
npm install
npm start
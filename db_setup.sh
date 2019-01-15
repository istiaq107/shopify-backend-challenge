#!/bin/bash
sudo apt-get update
sudo apt-get -y install postgresql postgresql-contrib
sudo -u postgres psql postgres < dump.sql
#!/bin/bash

psql -a -f initdb.sql
psql -d StocKing -a -f init_tables.sql
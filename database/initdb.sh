#!/bin/bash

psql -a -f initdb.sql
psql -U stocking -d StocKing -a -f init_tables.sql

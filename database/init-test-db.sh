#!/bin/bash

psql -a -f init-test-db.sql
psql -U stockingtest -d StocKingTest -a -f init_tables.sql

env--install:
	python3 -m venv env
	env/bin/pip install -r requirements.txt

.PHONY: server
server:
	export FLASK_APP=flaskr/app.py; \
	flask run --debug

test:
	python -m "pytest"
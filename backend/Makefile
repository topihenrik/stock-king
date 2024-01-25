env:
	env/bin/activate

env--install:
	python3 -m venv env
	env/bin/pip install -r requirements.txt

server:
	flask run

test:
	python -m "pytest"
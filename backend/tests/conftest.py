import pytest
from flaskr import app

@pytest.fixture()
def server():
    server = app.app
    server.config.update({
        "TESTING": True
    })

    yield server

@pytest.fixture()
def client(server):
    return server.test_client()


@pytest.fixture()
def runner(server):
    return server.test_cli_runner()


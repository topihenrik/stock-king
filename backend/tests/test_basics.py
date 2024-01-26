def test_hello_world(client):
    assert 1 == 1

def test_hello_world(client):
   response = client.get('/api')
   assert b"Hello World!" in response.data
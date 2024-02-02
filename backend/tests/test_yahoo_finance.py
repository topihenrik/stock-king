def test_hello_world(client):
   response = client.get('/api/randomCompany')
   responseString = response.data.decode()
   assert responseString.isdigit() == True
import os
import psycopg2
from psycopg2 import Error

def hello_world():
    return "Hello World!"

def lorem_ipsum():
    data = {
      "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lobortis condimentum arcu quis bibendum. Phasellus lacinia nisl non diam bibendum fringilla. Pellentesque quis justo tincidunt, lobortis elit a, egestas felis. Cras non eleifend sem. Donec non auctor mauris. Proin imperdiet nisi vel condimentum ultrices. Etiam non quam mi. In vel porta sapien. Nullam pulvinar id tellus nec sodales. Nunc faucibus a sapien ullamcorper lacinia. Aenean at porttitor orci. Donec ac massa id elit rutrum fringilla sed sed nunc. Ut dapibus dolor libero, eu mollis mi suscipit ut."
    }
    return data
  
def connect_to_db():
  """
  Function to connect to the database
  Returns: cursor object
  
  Example of use:\n
  cursor = utils.connect_to_db()\n
  cursor.execute("SELECT * FROM table_name")\n
  cursor.fetchall()\n
  cursor.close()
  """
  try:
      connection = psycopg2.connect(
          user=os.getenv('DB_USER'),
          password=os.getenv('DB_PASSWORD'),
          host=os.getenv('DB_HOST'),
          port=os.getenv('DB_PORT'),
          database=os.getenv('DB_DATABASE')
      )
      
      cursor = connection.cursor()
      print("Connected to Database")
      return cursor

  except (Exception, Error) as error:
      print("Error while connecting to PostgreSQL", error)
      return None
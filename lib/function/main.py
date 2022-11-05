from app import create_app
from flask_serverless import aws_invoke
app = create_app(__name__)

def run():
    app.run(host='0.0.0.0')


if __name__ == '__main__':
    run()

def lambda_handler(event, context):
   return aws_invoke(app,event)   
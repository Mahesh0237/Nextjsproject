
from fastapi import APIRouter, File, UploadFile, Form, Request
import os, datetime
router = APIRouter()

## connecting to database
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="maheshdb"
)

# getting all the employees data from database 
@router.get('/employees')
async def get_employees():
    
    mycursor = mydb.cursor()
    
    mycursor.execute("SELECT * FROM employees")
    
    myresult = mycursor.fetchall()
    
    #converting the data into json format
    employees = [{"id":row[0], "firstname":row[1], "lastname":row[2], "email":row[3], "phonecode":row[4], "phonenumber":row[5], "resume":row[6]} for row in myresult]
    
    return employees

# @router.post('/employees/addnew')
# async def add_data(firstname:str = Form(...), lastname:str = Form(...), email:str = Form(...), phonecode:str = Form(...), phonenumber:int = Form(...), resume: UploadFile = File(...)):
    
#     mycursor = mydb.cursor()
#     sql = "INSERT INTO employees (firstname, lastname, email, phonecode, phonenumber, resume ) VALUES ( %s, %s, %s, %s, %s, %s)"
    
#     # Get the original file name and extension
#     file_name, file_extension = os.path.splitext(resume.filename)
    
#     # Add a timestamp to the file name
#     timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#     new_file_name = f"{timestamp}_{file_name}{file_extension}"
    
#     # Insert the new file name into the database
#     val = (firstname, lastname, email, phonecode, phonenumber, new_file_name)
#     mycursor.execute(sql, val)
#     mydb.commit()

#     # Save the uploaded file with the new name
#     contents = await resume.read()
#     file_path = f"resumes/{new_file_name}"
#     with open(file_path, "wb") as f:
#         f.write(contents)

#     return timestamp, file_name, file_extension

@router.post('/employees/addnew')
async def add_data(request:Request):
    form_data = await request.form()
    firstname = form_data["firstname"]
    lastname= form_data["lastname"]
    email=form_data["email"]
    print(firstname)
    print(lastname)
    print(email)
    return firstname


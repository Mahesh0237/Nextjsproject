from fastapi import APIRouter, Form, HTTPException
import mysql.connector
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="opulentus"
)

@router.get('/register')
def user_register():
    return {"message": "Hello user"}

@router.post('/register/addnew')
def user_register_add(email: str = Form(...), password: str = Form(...)):
    
    passwordnew= pwd_context.hash(password)
    mycursor = mydb.cursor()
    sql = "SELECT * FROM users WHERE email = %s"
    val = (email,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()

    if result:
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        sql = "INSERT INTO users (email, password) VALUES (%s, %s)"
        val = (email, passwordnew)
        mycursor.execute(sql, val)
        mydb.commit()

        return {"message": "User created successfully!"}

@router.get('/login')
def user_login():
    return {"message": "Welcome to the login page"}


# define a function to generate token
def generate_token(email):
    # set token expiration time
    expires = datetime.utcnow() + timedelta(minutes=30)
    # create token payload with email and expiration time
    payload = {"email": email, "exp": expires}
    # encode token with a secret key
    token = jwt.encode(payload, "your_secret_key", algorithm="HS256")
    return token

@router.post('/login/validate')
def user_login_validate(email: str = Form(...), password: str = Form(...)):
    token = generate_token(email)
    mycursor = mydb.cursor()
    sql = "SELECT password FROM users WHERE email = %s"
    val = (email,)
    mycursor.execute(sql, val)
    result = mycursor.fetchone()

    if result is None:
        raise HTTPException(status_code=401, detail="invalid details")
    
    if not pwd_context.verify(password, result[0]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {"access_token": token, "token_type": "bearer"}


# from fastapi import APIRouter

# router = APIRouter()

# from pydantic import BaseModel

# class User(BaseModel):
#     id: int
#     firstname: str
#     lastname: str
#     email: str
#     phonecode:str
#     phonenumnber:int

# user_details = [
#      {"id":1, "firstname":"test1", "lastname":"testlast1", "email":"test1@gmail.com", "phonecode":+91, "phonenumnber": 8374259858 },
#     {"id":2, "firstname":"test2", "lastname":"testlast2", "email":"test2@gmail.com", "phonecode":+91, "phonenumnber": 8500143742 },
#     {"id":3, "firstname":"test3", "lastname":"testlast3", "email":"test3@gmail.com", "phonecode":+91, "phonenumnber": 8106019311}
# ]

# @router.get("/users")
# async def get_users():
#     return user_details

# @router.get("/users/{user_id}")
# async def get_user_id(user_id:int):
#     for user in user_details:
#         if(user["id"] == user_id):
#             return user
#         else:
#             return {"message":"no user found"}
#     return {"message": "got the single data"}

# @router.post("/users/addnew")
# async def add_user( firstname:str, lastname:str, email:str, phonecode: str, phonenumnber: int ):
#     key=len(user_details) +1
#     obj={"id":key, "firstname":firstname, "lastname":lastname,"email":email, "phonecode":phonecode, "phonenumnber": phonenumnber }
#     user_details.append(obj)
#     return {"mesage": "data posted"}

# @router.put("/users/{user_id}")
# async def update_user(user_id: int, user: User):
#     for idx, u in enumerate(user_details):
#         if u["id"] == user_id:
#             user_dict = user.dict()
#             user_dict["id"] = user_id
#             user_details[idx] = user_dict
#             return {"message": "User updated successfully"}
#     return {"message": "User not found"}

# @router.delete("/users/{user_id}")
# async def delete_user(user_id: int):
#     for idx, user in enumerate(user_details):
#         if user["id"] == user_id:
#             del user_details[idx]
#             return {"message": "User deleted successfully"}
#     return {"message": "User not found"}



from fastapi import APIRouter

router = APIRouter()

from pydantic import BaseModel, EmailStr

class User(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

## connecting to database
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="maheshdb"
)


# get all the data
#--------------------
@router.get("/userstwo")
async def get_users():
    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
    ####### converting to json format
    users = [{"id": row[0], "first_name": row[1], "last_name": row[2], "email": row[3]} for row in results]
    return users

# adding new data
#--------------------
@router.post("/userstwo/addnew")
async def add_user(user: User):    
    first_name = user.first_name
    last_name = user.last_name
    email = user.email
    
    cursor = mydb.cursor()
    sql = "INSERT INTO users (first_name, last_name, email) VALUES (%s, %s, %s)"
    val = (first_name, last_name, email)
    cursor.execute(sql, val)
    mydb.commit()

    return { 'message' : 'successfully updated'}

# geting the single data
#--------------------
@router.get("/userstwo/{user_id}")
async def get_user_by_id(user_id: int):
    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id))
    result = cursor.fetchone()
    if result:
        return {"user": result}
    else:
        return {"error": "User not found"}

#updating the data 
#--------------------  
@router.put("/userstwo/{user_id}")
async def update_user(user_id: int, firstname: str = None, lastname: str = None, email: str = None):
    cursor = mydb.cursor()
    sql = "UPDATE users SET"
    val = []

    if firstname:
        sql += " first_name = %s,"
        val.append(firstname)

    if lastname:
        sql += " last_name = %s,"
        val.append(lastname)

    if email:
        sql += " email = %s,"
        val.append(email)

    sql = sql[:-1] + " WHERE id = %s"
    val.append(user_id)

    cursor.execute(sql, tuple(val))
    mydb.commit()

    if cursor.rowcount == 0:
        return {"error": "User not found"}

    return {"message": "User updated successfully"}

#deleting the data
#--------------------
@router.delete("/userstwo/{user_id}")

async def delete_user(user_id: int):
    cursor = mydb.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    mydb.commit()

    if cursor.rowcount == 0:
        return {"error": "User not found"}

    return {"message": "User deleted successfully"}
    


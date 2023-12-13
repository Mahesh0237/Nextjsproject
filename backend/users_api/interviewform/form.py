from fastapi import APIRouter, Request
import uuid
import json
router= APIRouter()
import mysql.connector

mydb= mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="opulentusform"
)

@router.get('/candidatedetails')
def get_candidate_details():
    return {"message": "got the data"}


@router.post('/candidatedetails/addnew')
async def add_candidate_details(request:Request):
    form_data = await request.form()
    #  *******  fro multiple selection *******
    languages = form_data.getlist('languages[]')
    #  ******* for converting array into json *****
    languages_json = json.dumps(languages)
    
    # ******** for genrating uid ******
    uid = str(uuid.uuid4())
    mycursor= mydb.cursor()
    
    sql="INSERT INTO candidatedetails (uid, firstname, lastname, phonecode, phonenumber, email, highestqualification, course, specialisation, experience, currentlyworking, currentctccurrency, currentctcsalary, expectedctccurrency, expectedctcsalary, languages) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s )"
    val=(uid, form_data["firstname"], form_data["lastname"], form_data["phonecode"], form_data["phonenumber"], form_data["email"], form_data["highestqualification"], form_data["course"], form_data["specialisation"], form_data["experience"], form_data["currentlyworking"], form_data["currentctccurrency"], form_data["currentctcsalary"],form_data["expectedctccurrency"], form_data["expectedctcsalary"], languages_json )
    mycursor.execute(sql, val)
    mydb.commit()
    return {"uid":uid}


@router.get('/candidatedetails/{uid}')
async def uid_candidatedetails(uid: str):
    mycursor = mydb.cursor()

    # execute MySQL SELECT query to retrieve candidate data by uid
    mycursor.execute("SELECT * FROM candidatedetails WHERE uid = %s", (uid,))

    # retrieve the first row of results
    candidate = mycursor.fetchone()

    # close database cursor
    mycursor.close()

    if candidate:
        languages_list = json.loads(candidate[16])
        return {
            "id":candidate[1],
            "uid": candidate[1],
            "firstname": candidate[2],
            "lastname": candidate[3],
            "phonecode": candidate[4],
            "phonenumber":candidate[5],
            "email":candidate[6],
            "highestqualification":candidate[7],
            "course":candidate[8],
            "specialisation":candidate[9],
            "experience":candidate[10],
            "currentlyworking":candidate[11],
            "currentctccurrency":candidate[12],
            "currentctcsalary":candidate[13],
            "expectedctccurrency":candidate[14],
            "expectedctcsalary":candidate[15],
            "languages": languages_list
        }
    else:
        return {"message": "Candidate details not found"}


@router.post('/candidatedetails/{uid}')
async def uid_candidatedetails_add(uid: str, request: Request):
    form_data = await request.form()
    #  *******  for multiple selection *******
    languages = form_data.getlist('languages[]')
    #  ******* for converting array into json *****
    languages_json = json.dumps(languages)

    mycursor = mydb.cursor()
    mycursor.execute("SELECT uid FROM candidatedetails WHERE uid = %s", (uid,))
    candidate = mycursor.fetchone()
    mycursor.close()

    if candidate:
        # If the candidate already exists, update their data
        mycursor = mydb.cursor()
        sql = "UPDATE candidatedetails SET firstname=%s, lastname=%s, phonecode=%s, phonenumber=%s, email=%s, highestqualification=%s, course=%s, specialisation=%s, experience=%s, currentlyworking=%s, currentctccurrency=%s, currentctcsalary=%s, expectedctccurrency=%s, expectedctcsalary=%s, languages=%s WHERE uid=%s"
        val = (form_data["firstname"], form_data["lastname"], form_data["phonecode"], form_data["phonenumber"], form_data["email"], form_data["highestqualification"], form_data["course"], form_data["specialisation"], form_data["experience"], form_data["currentlyworking"] , form_data["currentctccurrency"], form_data["currentctcsalary"], form_data["expectedctccurrency"], form_data["expectedctcsalary"], languages_json, uid)
        mycursor.execute(sql, val)
        mydb.commit()
        mycursor.close()
    else:
        # If the candidate doesn't exist, insert their data
        mycursor = mydb.cursor()
        sql="INSERT INTO candidatedetails (uid, firstname, lastname, phonecode, phonenumber, email, highestqualification, course, specialisation, experience, currentlyworking, currentctccurrency, currentctcsalary, expectedctccurrency, expectedctcsalary, languages) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s )"
        val=(uid, form_data["firstname"], form_data["lastname"], form_data["phonecode"], form_data["phonenumber"], form_data["email"], form_data["highestqualification"], form_data["course"], form_data["specialisation"], form_data["experience"], form_data["currentlyworking"], form_data["currentctccurrency"], form_data["currentctcsalary"],form_data["expectedctccurrency"], form_data["expectedctcsalary"], languages_json )
        mycursor.execute(sql, val)
        mydb.commit()
        mycursor.close()


@router.get("/address/{uid}")
async def uid_address_details(uid:str):

    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()

    user_id = candidatedetails['id']

    # execute MySQL SELECT query to retrieve candidate data by uid
    mycursor.execute("SELECT * FROM address WHERE user_id = %s", (user_id,))

    # retrieve the first row of results
    addressdtls = mycursor.fetchone()

    # close database cursor
    mycursor.close()

    if addressdtls:
        return addressdtls
    else:
        return {
            "message": "address details not found"
        }


@router.post("/address/addnew/{uid}")
async def uid_addressdtls_add(uid:str, request:Request):
    form_data = await request.form()

    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()

    if candidatedetails is not None:
        user_id = candidatedetails['id']

        mycursor= mydb.cursor()
        sql="SELECT id FROM address WHERE user_id = %s"
        val=(user_id,)
        mycursor.execute(sql, val)
        existing_address = mycursor.fetchone()

        if existing_address:
            # If the uid already exists in the address table, update the existing record
            sql = "UPDATE address SET city = %s, state = %s, country = %s WHERE user_id = %s"
            val = (form_data["city"], form_data["state"], form_data["country"], user_id)
            mycursor.execute(sql, val)
            mydb.commit()
            message = "Address details updated successfully"
        else:
            # If the uid doesn't exist in the address table, insert a new record
            sql="INSERT INTO address (user_id, city, state, country) values(%s,%s, %s, %s)"
            val=(user_id,form_data["city"], form_data["state"], form_data["country"])
            mycursor.execute(sql,val)
           
            message = "Address details added successfully"

        mycursor.close()
        return {"message": message}
    else:
        return {"message" : "user details not found"}


@router.get("/emphistory/{uid}")
def get_emphistory(uid:str):

    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()
    user_id = candidatedetails['id']
    mycursor.execute("SELECT * FROM emphistory WHERE user_id = %s", (user_id,))
    expdtls = mycursor.fetchall()
    mycursor.close()

    if expdtls:
        print(expdtls)
        return expdtls
    else:
        return{
            "message": "experience details not found"
        }

@router.post("/emphistory/addnew/{uid}")
async def add_emphistory(uid:str, request:Request):

    form_data = await request.json()
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()
    emphis=form_data["experiencedtls"]

    if candidatedetails is not None:
        user_id = candidatedetails['id']
        for data in emphis:
            empdetails_id = data['empdetails_id']
            mycursor= mydb.cursor()
            if empdetails_id is not None:
                sql = "UPDATE emphistory SET employmentstatus=%s, employername=%s, designation=%s, fromdate=%s, todate=%s, currentsalarycurrency=%s, salary=%s, leavingreason=%s WHERE id = %s"
                val = (
                    data['empstatus'], 
                    data['employername'], 
                    data['designation'], 
                    data['fromdate'], 
                    data['todate'], 
                    data['currentsalarycurrency'], 
                    data['currentsalary'], 
                    data['leavingreason'],
                    empdetails_id
                )
                mycursor.execute(sql, val)
                mydb.commit()
            else:
                sql= "INSERT INTO emphistory (user_id,employmentstatus, employername, designation, fromdate, todate, currentsalarycurrency, salary, leavingreason) VALUES (%s, %s, %s, %s,%s, %s, %s,%s, %s)"    
                val = (
                    user_id,
                    data['empstatus'], 
                    data['employername'], 
                    data['designation'], 
                    data['fromdate'], 
                    data['todate'], 
                    data['currentsalarycurrency'], 
                    data['currentsalary'], 
                    data['leavingreason']
                )
                mycursor.execute(sql, val)
                mydb.commit()
            mycursor.close()
    else:
        return {"message": "user details not found"}


@router.get("/acedemicdetails/{uid}")
def get_acedemicdtls(uid:str):

    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()
    user_id = candidatedetails['id']
    mycursor.execute("SELECT * FROM acedemicdetails WHERE user_id = %s", (user_id,))
    expdtls = mycursor.fetchall()
    mycursor.close()

    if expdtls:
        return expdtls
    else:
        return{
            "message": "acedemic details not found"
        }


@router.post("/acedemicdetails/addnew/{uid}")
async def add_acedemicdtls(uid:str, request:Request):

    form_data = await request.json()
    mycursor = mydb.cursor(dictionary=True)
    mycursor.execute("SELECT id FROM candidatedetails WHERE uid = %s",  (uid,))
    candidatedetails = mycursor.fetchone()
    emphis=form_data["acedemicdtls"]

    if candidatedetails is not None:
        user_id = candidatedetails['id']
        for data in emphis:
            acedemicdtls_id = data['acedemicdtls_id']
            mycursor= mydb.cursor()
            if acedemicdtls_id is not None:
                sql = "UPDATE acedemicdetails SET education=%s, university=%s, course=%s, specialisation=%s, coursetype=%s, yearofcomplition=%s WHERE id = %s"
                val = (
                    data['education'], 
                    data['university'], 
                    data['course'], 
                    data['specialisation'], 
                    data['coursetype'], 
                    data['yearofcomplition'],
                    acedemicdtls_id
                )
                mycursor.execute(sql, val)
                mydb.commit()
            else:
                sql= "INSERT INTO acedemicdetails (user_id, education, university, course, specialisation, coursetype, yearofcomplition) VALUES (%s, %s, %s, %s,%s, %s, %s)"    
                val = (
                    user_id,
                    data['education'], 
                    data['university'], 
                    data['course'], 
                    data['specialisation'], 
                    data['coursetype'], 
                    data['yearofcomplition'],
                )
                mycursor.execute(sql, val)
                mydb.commit()
            mycursor.close()
    else:
        return {"message": "user details not found"}


# @router.get('/interviewassesment/{uid}')
# def get_interviewassesmentdetails():
#     return {"message":"got the interview assesment details"}

# @router.post('/interviewassesment/addnew/{uid}')
# async def add_interviewassesment_details(uid:str, request:Request):
#     form_data= await request.form()
#     mycursor= mydb.cursor(dictionary=True)
#     mycursor.execute("SELECT id from candidatedetails WHERE uid=%s",(uid,))
#     candidatedetails = mycursor.fetchone()
#     if candidatedetails is not None:
#         user_id = candidatedetails["id"]

#         mycursor= mydb.cursor()
#         sql="SELECT id FROM interviewassement WHERE user_id = %s"
#         val=(user_id,)
#         mycursor.execute(sql, val)
#         existing_address = mycursor.fetchone()


























#    # Get the uploaded file
#     resume = request.files["resume"]
#     file_path = os.path.join("uploads", resume.filename)
#     with open(file_path, "wb") as f:
#         f.write(await resume.read())
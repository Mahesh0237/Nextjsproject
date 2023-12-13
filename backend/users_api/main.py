from fastapi import FastAPI
from users.usersdata import router as user_router
from employee.employeesdata import router as employee_router
from Authentication.register import router as user_register_router
from interviewform.form import router as interview_form_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
########## it will allow the all domains #########
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(employee_router)
app.include_router(user_register_router)
app.include_router(interview_form_router)
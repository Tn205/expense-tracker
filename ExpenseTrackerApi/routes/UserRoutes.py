from fastapi import APIRouter
from controllers import UserController
from models.UserModel import User, UserOut, UserLogin
from fastapi import File, Form, UploadFile, Depends
from typing import Optional

router = APIRouter()


@router.get("/users")
async def getAllUsers():
    return await UserController.getAllUsers()


@router.get("/user/{id}")
async def getUserById(id: str):
    return await UserController.getUserById(id)


@router.get("/user/role/{id}")
async def getUserByRoleId(id: str):
    return await UserController.getUserByRoleId(id)


@router.post("/user")
async def addUser(user: User):
    return await UserController.addUser(user)

@router.post("/user/url")
async def addUserWithUrl(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    contact: str = Form(...),
    address: Optional[str] = Form(None),
    roleId: str = Form(...),
    image: UploadFile = File(...),
):
    return await UserController.addUserWithUrl(
        name, email, password, contact, address, roleId, image
    )


@router.delete("/user/{id}")
async def deleteUserById(id: str):
    return await UserController.deleteUserById(id)


@router.post("/user/login")
async def loginUser(request: UserLogin):
    return await UserController.loginUser(request)

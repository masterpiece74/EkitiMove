from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pwdlib import PasswordHash

from database import get_connection


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

password_hash = PasswordHash.recommended()


# -----------------------------------------
# REQUEST MODELS
# -----------------------------------------

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -----------------------------------------
# REGISTER
# -----------------------------------------

@router.post("/register")
def register_user(data: RegisterRequest):

    # Basic validation
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long."
        )

    if data.role not in ["Passenger", "Driver"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be Passenger or Driver."
        )

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            # Get role ID
            cursor.execute(
                """
                SELECT id
                FROM user_roles
                WHERE name = %s
                """,
                (data.role,)
            )

            role = cursor.fetchone()

            if not role:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid user role."
                )

            role_id = role[0]

            # Check if email already exists
            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE email = %s
                """,
                (data.email,)
            )

            if cursor.fetchone():
                raise HTTPException(
                    status_code=409,
                    detail="Email is already registered."
                )

            # Check if phone already exists
            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE phone = %s
                """,
                (data.phone,)
            )

            if cursor.fetchone():
                raise HTTPException(
                    status_code=409,
                    detail="Phone number is already registered."
                )

            # Hash password
            hashed_password = password_hash.hash(data.password)

            # Create user
            cursor.execute(
                """
                INSERT INTO users (
                    role_id,
                    full_name,
                    email,
                    phone,
                    password_hash
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    role_id,
                    data.full_name,
                    data.email,
                    data.phone,
                    hashed_password
                )
            )

            user_id = cursor.fetchone()[0]

            # Create appropriate profile
            if data.role == "Passenger":

                cursor.execute(
                    """
                    INSERT INTO passenger_profiles (
                        user_id
                    )
                    VALUES (%s)
                    """,
                    (user_id,)
                )

            elif data.role == "Driver":

                cursor.execute(
                    """
                    INSERT INTO driver_profiles (
                        user_id
                    )
                    VALUES (%s)
                    """,
                    (user_id,)
                )

            conn.commit()

            return {
                "message": f"{data.role} registered successfully.",
                "user_id": user_id,
                "role": data.role
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        print("Registration error:", error)

        raise HTTPException(
            status_code=500,
            detail="Registration failed."
        )

    finally:
        conn.close()


# -----------------------------------------
# LOGIN
# -----------------------------------------

@router.post("/login")
def login_user(data: LoginRequest):

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            # Find user by email
            cursor.execute(
                """
                SELECT
                    u.id,
                    u.full_name,
                    u.email,
                    u.phone,
                    u.password_hash,
                    ur.name
                FROM users u
                JOIN user_roles ur
                    ON u.role_id = ur.id
                WHERE u.email = %s
                """,
                (data.email,)
            )

            user = cursor.fetchone()

            # User not found
            if not user:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password."
                )

            user_id = user[0]
            full_name = user[1]
            email = user[2]
            phone = user[3]
            hashed_password = user[4]
            role = user[5]

            # Verify password
            if not password_hash.verify(
                data.password,
                hashed_password
            ):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password."
                )

            # Login successful
            return {
                "message": "Login successful.",
                "user": {
                    "id": user_id,
                    "full_name": full_name,
                    "email": email,
                    "phone": phone,
                    "role": role
                }
            }

    except HTTPException:
        raise

    except Exception as error:
        print("Login error:", error)

        raise HTTPException(
            status_code=500,
            detail="Login failed."
        )

    finally:
        conn.close()